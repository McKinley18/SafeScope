import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import PageHeader from '../../src/components/ui/PageHeader';
import AppBanner from '../../src/components/ui/AppBanner';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://safescope-backend.onrender.com';
const ANALYTICS_CACHE_KEY = 'safescope_dashboard_cache';
const ANALYTICS_CACHE_TIME_KEY = 'safescope_dashboard_cache_time';

type AgingBucket = {
  bucket: string;
  count: number;
};

type HazardRecurrence = {
  hazard: string;
  count: number;
};

type DashboardResponse = {
  totalReports?: number;
  openReports?: number;
  reviewQueueCount?: number;
  overdueActionsCount?: number;
  analytics?: {
    avgReviewTime?: number;
    avgCloseTime?: number;
    hazardRecurrence?: HazardRecurrence[];
    aging?: {
      reviewAging?: AgingBucket[];
      actionAging?: AgingBucket[];
    };
  };
};

export default function AnalyticsScreen() {
  const { colors } = useAppTheme();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [cacheTime, setCacheTime] = useState<string>('');

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
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

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
    return data?.analytics?.hazardRecurrence?.slice(0, 5) || [];
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
      <View style={[styles.centerState, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.stateTitle, { color: colors.text }]}>Loading intelligence…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerState, { backgroundColor: colors.bg }]}>
        <Ionicons name="alert-circle-outline" size={34} color={colors.accent} />
        <Text style={[styles.stateTitle, { color: colors.text }]}>Analytics unavailable</Text>
        <Text style={[styles.stateSub, { color: colors.sub }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <AppBanner section="Executive Intelligence" />

      <PageHeader
        eyebrow="Intelligence"
        title="Executive Analytics"
        subtitle="Live operational intelligence from reports, reviews, and action performance."
      />

      <View style={styles.headerMetaRow}>
        <Text style={[styles.cacheMeta, { color: colors.muted }]}>
          {refreshing ? 'Refreshing in background…' : 'Loaded'}
          {cacheTime ? ` • Last updated ${new Date(cacheTime).toLocaleTimeString()}` : ''}
        </Text>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.cardAlt, borderColor: colors.border },
          ]}
        >
          <Ionicons name="options-outline" size={16} color={colors.text} />
          <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.kpiGrid}>
        {kpis.map((item) => (
          <AppCard key={item.label} style={styles.kpiCard}>
            <View style={styles.kpiTop}>
              <View style={[styles.iconWrap, { backgroundColor: colors.cardAlt }]}>
                <Ionicons name={item.icon} size={18} color={colors.accent} />
              </View>
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{item.value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.muted }]}>{item.label}</Text>
          </AppCard>
        ))}
      </View>

      <View style={styles.dualGrid}>
        <AppCard style={styles.metricCard}>
          <Text style={[styles.metricTitle, { color: colors.text }]}>Avg Review Time</Text>
          <Text style={[styles.metricValue, { color: colors.accent }]}>
            {data?.analytics?.avgReviewTime ? `${data.analytics.avgReviewTime.toFixed(1)} hrs` : 'N/A'}
          </Text>
          <Text style={[styles.metricSub, { color: colors.sub }]}>
            Average classification review turnaround
          </Text>
        </AppCard>

        <AppCard style={styles.metricCard}>
          <Text style={[styles.metricTitle, { color: colors.text }]}>Avg Close Time</Text>
          <Text style={[styles.metricValue, { color: colors.accent }]}>
            {data?.analytics?.avgCloseTime ? `${data.analytics.avgCloseTime.toFixed(1)} days` : 'N/A'}
          </Text>
          <Text style={[styles.metricSub, { color: colors.sub }]}>
            Average corrective action close time
          </Text>
        </AppCard>
      </View>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Hazard Recurrence</Text>

        {topHazards.length === 0 ? (
          <View style={[styles.emptyWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>No hazard recurrence data yet.</Text>
          </View>
        ) : (
          topHazards.map((item, index) => (
            <View
              key={`${item.hazard}-${index}`}
              style={[
                styles.row,
                index < topHazards.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.rowTitle, { color: colors.text }]}>
                {item.hazard || 'Uncategorized'}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: colors.cardAlt }]}>
                <Text style={[styles.countBadgeText, { color: colors.accent }]}>{item.count}</Text>
              </View>
            </View>
          ))
        )}
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Review Aging</Text>

        {reviewAging.length === 0 ? (
          <View style={[styles.emptyWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>No pending review aging data yet.</Text>
          </View>
        ) : (
          reviewAging.map((item, index) => (
            <View
              key={`${item.bucket}-${index}`}
              style={[
                styles.row,
                index < reviewAging.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.bucket}</Text>
              <Text style={[styles.score, { color: colors.accent }]}>{item.count}</Text>
            </View>
          ))
        )}
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Action Aging</Text>

        {actionAging.length === 0 ? (
          <View style={[styles.emptyWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>No corrective action aging data yet.</Text>
          </View>
        ) : (
          actionAging.map((item, index) => (
            <View
              key={`${item.bucket}-${index}`}
              style={[
                styles.row,
                index < actionAging.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.bucket}</Text>
              <Text style={[styles.score, { color: colors.accent }]}>{item.count}</Text>
            </View>
          ))
        )}
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
    flexGrow: 1,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  stateTitle: {
    marginTop: tokens.spacing.sm,
    fontSize: tokens.type.h2,
    fontWeight: '800',
  },
  stateSub: {
    marginTop: 8,
    fontSize: tokens.type.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  headerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  cacheMeta: {
    flex: 1,
    fontSize: tokens.type.small,
    fontWeight: '600',
  },
  filterButton: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: tokens.type.small,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  kpiCard: {
    width: '48%',
  },
  kpiTop: {
    marginBottom: tokens.spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: tokens.type.kpi,
    fontWeight: '800',
  },
  kpiLabel: {
    marginTop: 4,
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  dualGrid: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  metricCard: {},
  metricTitle: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  metricSub: {
    fontSize: tokens.type.small,
    lineHeight: 18,
  },
  sectionCard: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '800',
    marginBottom: tokens.spacing.md,
  },
  emptyWrap: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
  },
  emptyText: {
    fontSize: tokens.type.body,
    fontWeight: '600',
  },
  row: {
    paddingVertical: tokens.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  rowTitle: {
    flex: 1,
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countBadgeText: {
    fontSize: tokens.type.small,
    fontWeight: '800',
  },
  score: {
    fontSize: tokens.type.body,
    fontWeight: '800',
  },
});
