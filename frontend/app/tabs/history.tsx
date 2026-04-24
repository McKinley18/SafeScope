import {
  Alert, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
  attachments?: any[];
};

const filters = ['all', 'draft', 'submitted', 'approved', 'rejected', 'closed'];

export default function HistoryScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await apiClient.getReports({
        page: 1,
        limit: 100,
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

  const filteredReports = useMemo(() => {
    const q = query.trim().toLowerCase();

    return reports
      .filter((report) => {
        const status = String(report.reportStatus || 'draft').toLowerCase();
        return activeFilter === 'all' || status === activeFilter;
      })
      .filter((report) => {
        if (!q) return true;

        const blob = [
          report.id,
          report.title,
          report.hazardDescription,
          report.narrative,
          report.area,
          report.siteName,
          report.severity,
          report.reportStatus,
          report.eventTypeCode,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return blob.includes(q);
      })
      .sort((a, b) => {
        const aTime = new Date(a.reportedDatetime || a.createdAt || 0).getTime();
        const bTime = new Date(b.reportedDatetime || b.createdAt || 0).getTime();
        return bTime - aTime;
      });
  }, [reports, query, activeFilter]);

  const stats = useMemo(() => {
    const total = reports.length;
    const approved = reports.filter((r) => String(r.reportStatus || '').toLowerCase() === 'approved').length;
    const submitted = reports.filter((r) => String(r.reportStatus || '').toLowerCase() === 'submitted').length;
    const highRisk = reports.filter((r) => {
      const sev = String(r.severity || '').toLowerCase();
      return sev === 'high' || sev === 'critical';
    }).length;

    return { total, approved, submitted, highRisk };
  }, [reports]);

  const archiveReport = async (id: string) => {
    Alert.alert(
      'Archive report?',
      'This removes the report from active lists while preserving the record.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: async () => {
            await apiClient.archiveReport(id);
            await loadReports();
          },
        },
      ]
    );
  };

  const deleteReport = async (id: string) => {
    Alert.alert(
      'Delete report?',
      'This hides the report from active records. Only use this if allowed by your record retention policy.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await apiClient.deleteReport(id);
            await loadReports();
          },
        },
      ]
    );
  };

  const statusColor = (status?: string) => {
    const value = String(status || '').toLowerCase();

    if (value === 'approved' || value === 'closed') return '#10b981';
    if (value === 'submitted') return colors.accent;
    if (value === 'rejected') return '#ef4444';
    if (value === 'draft') return '#f59e0b';

    return colors.muted;
  };

  const severityColor = (severity?: string) => {
    const value = String(severity || '').toLowerCase();

    if (value === 'critical') return '#ef4444';
    if (value === 'high') return '#f97316';
    if (value === 'medium') return '#f59e0b';
    if (value === 'low') return '#10b981';

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
    return report.title || report.hazardDescription || report.narrative || 'Untitled Safety Report';
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
        title="Reports Center"
        subtitle="Search, filter, review, and open executive-grade safety reports."
      />

      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Total</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.submitted}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>In Review</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.approved}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Approved</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.highRisk}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>High Risk</Text>
        </AppCard>
      </View>

      <AppCard style={styles.controlsCard}>
        <View style={[styles.searchBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search reports, hazards, areas, IDs..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.accent : colors.cardAlt,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, { color: active ? '#fff' : colors.text }]}>
                  {filter === 'all' ? 'All' : filter.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={loadReports}
          style={[styles.refreshButton, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.text} />
          <Text style={[styles.refreshText, { color: colors.text }]}>Refresh Live Data</Text>
        </TouchableOpacity>
      </AppCard>

      {error ? (
        <AppCard style={styles.reportCard}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Reports unavailable</Text>
          <Text style={[styles.emptyText, { color: colors.sub }]}>{error}</Text>
        </AppCard>
      ) : filteredReports.length === 0 ? (
        <AppCard style={styles.reportCard}>
          <Ionicons name="document-text-outline" size={26} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No matching reports</Text>
          <Text style={[styles.emptyText, { color: colors.sub }]}>
            Your operational record will build automatically as inspections are submitted, reviewed, and closed.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/tabs/camera')}
            style={[styles.emptyAction, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.emptyActionText}>Start Inspection</Text>
          </TouchableOpacity>
        </AppCard>
      ) : (
        filteredReports.map((report) => {
          const status = report.reportStatus || 'draft';
          const severity = report.severity || 'N/A';

          return (
            <TouchableOpacity
              key={report.displayId || report.id}
              activeOpacity={0.85}
              onPress={() => router.push(`/tabs/report?id=${report.displayId || report.id}` as any)}
            >
              <AppCard style={styles.reportCard}>
                <View style={styles.reportTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reportId, { color: colors.accent }]}>{report.displayId || report.id}</Text>
                    <Text style={[styles.reportTitle, { color: colors.text }]}>{getTitle(report)}</Text>
                    <Text style={[styles.reportMeta, { color: colors.sub }]}>
                      {getLocation(report)} • {report.eventTypeCode || 'Safety Report'}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward-outline" size={22} color={colors.muted} />
                </View>

                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: colors.cardAlt, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.statusDot, { backgroundColor: statusColor(status) }]} />
                    <Text style={[styles.statusText, { color: colors.text }]}>
                      {String(status).replace(/_/g, ' ')}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: colors.cardAlt, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.statusDot, { backgroundColor: severityColor(severity) }]} />
                    <Text style={[styles.statusText, { color: colors.text }]}>
                      {String(severity)}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={[styles.smallAction, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
                    onPress={(event) => {
                      event.stopPropagation();
                      archiveReport(report.id);
                    }}
                  >
                    <Text style={[styles.smallActionText, { color: colors.text }]}>Archive</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.smallAction, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
                    onPress={(event) => {
                      event.stopPropagation();
                      deleteReport(report.id);
                    }}
                  >
                    <Text style={[styles.smallActionText, { color: '#ef4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metricBlock}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                      {report.attachments?.length || 0}
                    </Text>
                    <Text style={[styles.metricLabel, { color: colors.sub }]}>Evidence</Text>
                  </View>

                  <View style={styles.metricBlock}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                      {formatDate(report.reportedDatetime || report.createdAt)}
                    </Text>
                    <Text style={[styles.metricLabel, { color: colors.sub }]}>Reported</Text>
                  </View>

                  <View style={styles.metricBlock}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                      Open
                    </Text>
                    <Text style={[styles.metricLabel, { color: colors.sub }]}>Detail</Text>
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
    paddingBottom: 20,
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
    fontWeight: '900',
  },
  kpiLabel: {
    fontSize: tokens.type.small,
    fontWeight: '700',
    marginTop: 4,
  },
  controlsCard: {
    marginBottom: tokens.spacing.lg,
  },
  searchBox: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: tokens.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  filterRow: {
    gap: 8,
    paddingBottom: tokens.spacing.md,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterText: {
    fontSize: tokens.type.small,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  refreshButton: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshText: {
    fontSize: tokens.type.small,
    fontWeight: '800',
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
  reportId: {
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 5,
    lineHeight: 22,
  },
  reportMeta: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: tokens.spacing.md,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
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
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: tokens.spacing.md,
  },
  smallAction: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallActionText: {
    fontSize: 11,
    fontWeight: '900',
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
    fontWeight: '900',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  metricLabel: {
    fontSize: tokens.type.small,
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '900',
    marginTop: tokens.spacing.sm,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: tokens.type.body,
    lineHeight: 20,
    fontWeight: '600',
  },
  emptyAction: {
    marginTop: tokens.spacing.md,
    minHeight: 46,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActionText: {
    color: '#fff',
    fontSize: tokens.type.body,
    fontWeight: '900',
  },
});
