import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import PageHeader from '../../src/components/ui/PageHeader';

type ReportItem = {
  id: string;
  title: string;
  site: string;
  status: 'Published' | 'In Review' | 'Closed';
  highRiskFindings: number;
  totalFindings: number;
  date: string;
};

const reports: ReportItem[] = [
  {
    id: 'RPT-2401',
    title: 'North Plant Weekly Audit',
    site: 'North Ridge Plant',
    status: 'Published',
    highRiskFindings: 2,
    totalFindings: 12,
    date: 'Apr 22, 2026',
  },
  {
    id: 'RPT-2402',
    title: 'Processing Area B Walkthrough',
    site: 'Processing Area B',
    status: 'In Review',
    highRiskFindings: 1,
    totalFindings: 6,
    date: 'Apr 21, 2026',
  },
  {
    id: 'RPT-2403',
    title: 'South Mezzanine Safety Check',
    site: 'South Mezzanine',
    status: 'Closed',
    highRiskFindings: 0,
    totalFindings: 3,
    date: 'Apr 19, 2026',
  },
  {
    id: 'RPT-2404',
    title: 'Crusher Platform Inspection',
    site: 'Crusher Platform',
    status: 'Published',
    highRiskFindings: 3,
    totalFindings: 9,
    date: 'Apr 18, 2026',
  },
];

export default function HistoryScreen() {
  const { colors } = useAppTheme();

  const publishedCount = reports.filter((r) => r.status === 'Published').length;
  const reviewCount = reports.filter((r) => r.status === 'In Review').length;
  const closedCount = reports.filter((r) => r.status === 'Closed').length;

  const statusColor = (status: ReportItem['status']) => {
    if (status === 'Published') return colors.accent;
    if (status === 'In Review') return '#f59e0b';
    return '#10b981';
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <PageHeader
        title="Operational Record"
        subtitle="Track completed audits, active reviews, and historical reporting performance."
      />

      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{reports.length}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Total Reports</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{publishedCount}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Published</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{reviewCount}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>In Review</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{closedCount}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Closed</Text>
        </AppCard>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Reports</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <Ionicons name="options-outline" size={16} color={colors.text} />
          <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      {reports.map((report) => (
        <AppCard key={report.id} style={styles.reportCard}>
          <View style={styles.reportTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.reportTitle, { color: colors.text }]}>{report.title}</Text>
              <Text style={[styles.reportMeta, { color: colors.sub }]}>
                {report.id} • {report.site}
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
                  { backgroundColor: statusColor(report.status) },
                ]}
              />
              <Text style={[styles.statusText, { color: colors.text }]}>{report.status}</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricBlock}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {report.highRiskFindings}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.sub }]}>High-Risk</Text>
            </View>

            <View style={styles.metricBlock}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {report.totalFindings}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.sub }]}>Findings</Text>
            </View>

            <View style={styles.metricBlock}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {report.date}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.sub }]}>Reported</Text>
            </View>
          </View>
        </AppCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
    flexGrow: 1,
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
  },
  metricLabel: {
    fontSize: tokens.type.small,
    fontWeight: '600',
  },
});
