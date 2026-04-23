import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../../src/theme/ThemeContext';

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

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://safescope-backend.onrender.com';
const ANALYTICS_CACHE_KEY = 'safescope_dashboard_cache';
const ANALYTICS_CACHE_TIME_KEY = 'safescope_dashboard_cache_time';

export default function AnalyticsScreen() {
  const { colors } = useAppTheme();

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [cacheTime, setCacheTime] = useState<string>('');

  const bg = colors.bg;
  const card = colors.card;
  const cardAlt = colors.cardAlt;
  const border = colors.border;
  const text = colors.text;
  const sub = colors.sub;
  const muted = colors.muted;

  useEffect(() => {
    const load = async () => {
      try {
        const cached = await AsyncStorage.getItem(ANALYTICS_CACHE_KEY);
        const cachedTime = await AsyncStorage.getItem(ANALYTICS_CACHE_TIME_KEY);

        if (cached) {
          setData(JSON.parse(cached));
          if (cachedTime) setCacheTime(cachedTime);
          setLoading(false);
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const res = await fetch(`${API_URL}/dashboard/overview`);
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        const now = new Date().toISOString();
        setCacheTime(now);

        await AsyncStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(json));
        await AsyncStorage.setItem(ANALYTICS_CACHE_TIME_KEY, now);

        setError('');
      } catch (err: any) {
        if (!data) {
          setError(err?.message || 'Failed to load analytics');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
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
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: text }]}>Executive Analytics</Text>
          <Text style={[styles.subtitle, { color: sub }]}>
            Live operational intelligence from SafeScope reports and reviews.
          </Text>
          <Text style={[styles.cacheMeta, { color: muted }]}>
            {refreshing ? 'Refreshing in background…' : 'Loaded'}
            {cacheTime ? ` • Last updated ${new Date(cacheTime).toLocaleTimeString()}` : ''}
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
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
  },
  stateSub: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  headerRow: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  cacheMeta: {
    fontSize: 12,
    marginTop: 6,
  },
  filterButton: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  kpiGrid: {
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,106,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  trendGrid: {
    gap: 12,
    marginBottom: 18,
  },
  trendCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
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
    marginBottom: 6,
  },
  trendSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  panel: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  row: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  badge: {
    minWidth: 36,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,106,0,0.12)',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ff6a00',
    fontWeight: '700',
    fontSize: 12,
  },
  score: {
    color: '#ff6a00',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyWrap: {
    padding: 16,
  },
  emptyText: {
    fontSize: 13,
  },
  footerMeta: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});
