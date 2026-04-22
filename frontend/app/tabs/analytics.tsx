import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DashboardResponse = {
  totalReports?: number;
  openReports?: number;
  reviewQueueCount?: number;
  overdueActionsCount?: number;
  reportsOverTime?: Array<{ date: string; count: string | number }>;
  pendingVsReviewed?: Array<{ status: string; count: string | number }>;
  analytics?: {
    avgReviewTime?: number;
    avgCloseTime?: number;
    hazardRecurrence?: Array<{ hazard: string; count: string | number }>;
    aging?: {
      reviewAging?: Array<{ bucket: string; count: string | number }>;
      actionAging?: Array<{ bucket: string; count: string | number }>;
    };
  };
  timestamp?: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function AnalyticsScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bg = dark ? '#050505' : '#f8fafc';
  const card = dark ? '#111111' : '#ffffff';
  const cardAlt = dark ? '#171717' : '#f1f5f9';
  const border = dark ? '#232323' : '#e5e7eb';
  const text = dark ? '#ffffff' : '#111827';
  const sub = dark ? '#cbd5e1' : '#475569';
  const muted = dark ? '#9ca3af' : '#64748b';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_URL}/dashboard/overview`);
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const topHazards = useMemo(() => {
    return data?.analytics?.hazardRecurrence?.slice(0, 4) || [];
  }, [data]);

  const reviewAging = data?.analytics?.aging?.reviewAging || [];
  const actionAging = data?.analytics?.aging?.actionAging || [];

  const kpis = [
    {
      label: 'Total Reports',
      value: String(data?.totalReports ?? 0),
      icon: 'document-text-outline' as const,
    },
    {
      label: 'Open Reports',
      value: String(data?.openReports ?? 0),
      icon: 'folder-open-outline' as const,
    },
    {
      label: 'Pending Reviews',
      value: String(data?.reviewQueueCount ?? 0),
      icon: 'clipboard-outline' as const,
    },
    {
      label: 'Overdue Actions',
      value: String(data?.overdueActionsCount ?? 0),
      icon: 'alarm-outline' as const,
    },
  ];

  if (loading) {
    return (
      <View style={[styles.centerState, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color="#ff6a00" />
        <Text style={[styles.stateTitle, { color: text, marginTop: 12 }]}>Loading analytics…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerState, { backgroundColor: bg }]}>
        <Ionicons name="alert-circle-outline" size={34} color="#ff6a00" />
        <Text style={[styles.stateTitle, { color: text }]}>Analytics unavailable</Text>
        <Text style={[styles.stateSub, { color: sub }]}>{error}</Text>
        <Text style={[styles.stateSub, { color: muted }]}>API URL: {API_URL}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: text }]}>Executive Analytics</Text>
          <Text style={[styles.subtitle, { color: sub }]}>
            Live operational intelligence from SafeScope reports and reviews.
          </Text>
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: cardAlt, borderColor: border }]}>
          <Ionicons name="options-outline" size={18} color={text} />
          <Text style={[styles.filterText, { color: text }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.kpiGrid}>
        {kpis.map((item) => (
          <View key={item.label} style={[styles.kpiCard, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.kpiTop}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={18} color="#ff6a00" />
              </View>
            </View>
            <Text style={[styles.kpiValue, { color: text }]}>{item.value}</Text>
            <Text style={[styles.kpiLabel, { color: muted }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: text }]}>Performance Metrics</Text>
      </View>

      <View style={styles.trendGrid}>
        <View style={[styles.trendCard, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.trendTitle, { color: text }]}>Avg Review Time</Text>
          <Text style={styles.trendValue}>
            {data?.analytics?.avgReviewTime ? `${data.analytics.avgReviewTime.toFixed(1)} hrs` : 'N/A'}
          </Text>
          <Text style={[styles.trendSub, { color: muted }]}>Average classification review turnaround</Text>
        </View>

        <View style={[styles.trendCard, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.trendTitle, { color: text }]}>Avg Close Time</Text>
          <Text style={styles.trendValue}>
            {data?.analytics?.avgCloseTime ? `${data.analytics.avgCloseTime.toFixed(1)} days` : 'N/A'}
          </Text>
          <Text style={[styles.trendSub, { color: muted }]}>Average corrective action close time</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: text }]}>Top Hazard Recurrence</Text>
      </View>

      <View style={[styles.panel, { backgroundColor: card, borderColor: border }]}>
        {topHazards.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: muted }]}>No hazard recurrence data yet.</Text>
          </View>
        ) : (
          topHazards.map((item, index) => (
            <View
              key={`${item.hazard}-${index}`}
              style={[
                styles.row,
                index < topHazards.length - 1 && { borderBottomWidth: 1, borderBottomColor: border },
              ]}
            >
              <Text style={[styles.rowTitle, { color: text }]}>{item.hazard || 'Uncategorized'}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.count}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: text }]}>Review Aging</Text>
      </View>

      <View style={[styles.panel, { backgroundColor: card, borderColor: border }]}>
        {reviewAging.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: muted }]}>No pending review aging data yet.</Text>
          </View>
        ) : (
          reviewAging.map((item, index) => (
            <View
              key={`${item.bucket}-${index}`}
              style={[
                styles.row,
                index < reviewAging.length - 1 && { borderBottomWidth: 1, borderBottomColor: border },
              ]}
            >
              <Text style={[styles.rowTitle, { color: text }]}>{item.bucket}</Text>
              <Text style={styles.score}>{item.count}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: text }]}>Action Aging</Text>
      </View>

      <View style={[styles.panel, { backgroundColor: card, borderColor: border }]}>
        {actionAging.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: muted }]}>No corrective action aging data yet.</Text>
          </View>
        ) : (
          actionAging.map((item, index) => (
            <View
              key={`${item.bucket}-${index}`}
              style={[
                styles.row,
                index < actionAging.length - 1 && { borderBottomWidth: 1, borderBottomColor: border },
              ]}
            >
              <Text style={[styles.rowTitle, { color: text }]}>{item.bucket}</Text>
              <Text style={styles.score}>{item.count}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={[styles.footerMeta, { color: muted }]}>
        Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unavailable'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
  },
  centerState: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  stateSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
  },
  filterButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kpiCard: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,106,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  panel: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  score: {
    color: '#ff6a00',
    fontSize: 22,
    fontWeight: '800',
  },
  trendGrid: {
    marginBottom: 18,
  },
  trendCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  trendTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  trendValue: {
    color: '#ff6a00',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  trendSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: 'rgba(255,106,0,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ff6a00',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyWrap: {
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
  },
  footerMeta: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
