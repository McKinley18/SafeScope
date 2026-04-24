import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import PageHeader from '../../src/components/ui/PageHeader';
import AppFooter from '../../src/components/ui/AppFooter';
import { apiClient } from '../../src/api/client';

type ReportItem = {
  id: string;
  title?: string;
  narrative?: string;
  hazardDescription?: string;
  area?: string;
  siteName?: string;
  reportStatus?: string;
  severity?: string;
  eventTypeCode?: string;
  reportedDatetime?: string;
  createdAt?: string;
};

export default function HistoryScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await apiClient.getReports({
        page: 1,
        limit: 50,
      });

      const rows = Array.isArray(result) ? result : result?.data || [];
      setReports(rows);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const draft = reports.filter((r) => String(r.reportStatus || '').toLowerCase() === 'draft').length;
    const submitted = reports.filter((r) => String(r.reportStatus || '').toLowerCase() === 'submitted').length;
    const closed = reports.filter((r) => String(r.reportStatus || '').toLowerCase() === 'closed').length;

    return { total, draft, submitted, closed };
  }, [reports]);

  const statusColor = (status?: string) => {
    const value = String(status || '').toLowerCase();

    if (value === 'submitted' || value === 'published') return colors.accent;
    if (value === 'draft' || value === 'in_review' || value === 'in review') return '#f59e0b';
    if (value === 'closed' || value === 'approved') return '#10b981';

    return colors.muted;
  };

  const formatDate = (value?: string) => {
    if (!value) return 'Not dated';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not dated';

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTitle = (report: ReportItem) => {
    return (
      report.title ||
      report.hazardDescription ||
      report.narrative ||
      'Untitled Safety Report'
    );
  };

  const getLocation = (report: ReportItem) => {
    return report.area || report.siteName || 'Unassigned Area';
  };

  if (loading) {
    return (
      <View style={[styles.centerState, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.stateTitle, { color: colors.text }]}>Loading reports…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <PageHeader
        title="Operational Record"
        subtitle="Live reports from SafeScope intake, review, and corrective action workflows."
      />

      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Total</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.draft}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Draft</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.submitted}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Submitted</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.closed}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Closed</Text>
        </AppCard>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Reports</Text>

        <TouchableOpacity
          onPress={loadReports}
          style={[styles.filterButton, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.text} />
          <Text style={[styles.filterText, { color: colors.text }]}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <AppCard style={styles.reportCard}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Reports unavailable</Text>
          <Text style={[styles.emptyText, { color: colors.sub }]}>{error}</Text>
        </AppCard>
      ) : reports.length === 0 ? (
        <AppCard style={styles.reportCard}>
          <Ionicons name="document-text-outline" size={24} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No reports yet</Text>
          <Text style={[styles.emptyText, { color: colors.sub }]}>
            Your operational record will build automatically as inspections are submitted, reviewed, and closed.
          </Text>
        </AppCard>
      ) : (
        reports.map((report) => {
          const status = report.reportStatus || 'draft';

          return (
            <TouchableOpacity key={report.id} onPress={() => router.push(`/tabs/report?id=${report.id}` as any)}>
              <AppCard style={styles.reportCard}>
              <View style={styles.reportTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reportTitle, { color: colors.text }]}>{getTitle(report)}</Text>
                  <Text style={[styles.reportMeta, { color: colors.sub }]}>
                    {report.id} • {getLocation(report)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: colors.cardAlt, borderColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusColor(status) },
                    ]}
                  />
                  <Text style={[styles.statusText, { color: colors.text }]}>
                    {String(status).replace(/_/g, ' ')}
                  </Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricBlock}>
                  <Text style={[styles.metricValue, { color: colors.text }]}>
                    {report.severity || 'N/A'}
                  </Text>
                  <Text style={[styles.metricLabel, { color: colors.sub }]}>Severity</Text>
                </View>

                <View style={styles.metricBlock}>
                  <Text style={[styles.metricValue, { color: colors.text }]}>
                    {report.eventTypeCode || 'Report'}
                  </Text>
                  <Text style={[styles.metricLabel, { color: colors.sub }]}>Type</Text>
                </View>

                <View style={styles.metricBlock}>
                  <Text style={[styles.metricValue, { color: colors.text }]}>
                    {formatDate(report.reportedDatetime || report.createdAt)}
                  </Text>
                  <Text style={[styles.metricLabel, { color: colors.sub }]}>Reported</Text>
                </View>
              </View>
              </AppCard>
            </TouchableOpacity>
          );
        })
      )}
      <AppFooter />
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
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  kpiCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  kpiValue: {
    fontSize: tokens.type.kpi,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: tokens.type.small,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: tokens.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '800',
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
  reportCard: {
    marginBottom: tokens.spacing.md,
  },
  reportTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  reportTitle: {
    fontSize: tokens.type.body,
    fontWeight: '800',
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: tokens.type.small,
    fontWeight: '600',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusText: {
    fontSize: tokens.type.small,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
  },
  metricBlock: {
    flex: 1,
  },
  metricValue: {
    fontSize: tokens.type.body,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  metricLabel: {
    fontSize: tokens.type.small,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '800',
    marginTop: tokens.spacing.sm,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: tokens.type.body,
    lineHeight: 20,
  },
});
