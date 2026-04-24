import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import PageHeader from '../../src/components/ui/PageHeader';
import AppFooter from '../../src/components/ui/AppFooter';
import { apiClient } from '../../src/api/client';

export default function ReportDetailScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const reportId = String(params.id || '');

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!reportId) {
        setError('Missing report ID.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await apiClient.getReportDetail(reportId);
        setReport(result);
      } catch (err: any) {
        setError(err?.message || 'Unable to load report.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reportId]);

  const title = useMemo(() => {
    return report?.title || report?.hazardDescription || report?.narrative || 'Safety Report';
  }, [report]);

  const status = String(report?.reportStatus || 'draft').replace(/_/g, ' ');
  const severity = String(report?.severity || 'N/A');

  const attachments = report?.attachments || [];
  const classifications = report?.classifications || [];
  const reviews = report?.reviews || [];
  const actions = report?.actions || [];

  const statusColor = () => {
    const value = String(report?.reportStatus || '').toLowerCase();
    if (value === 'approved' || value === 'closed') return '#10b981';
    if (value === 'submitted') return colors.accent;
    if (value === 'rejected') return '#ef4444';
    return '#f59e0b';
  };

  if (loading) {
    return (
      <View style={[styles.centerState, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.stateTitle, { color: colors.text }]}>Loading report…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerState, { backgroundColor: colors.bg }]}>
        <Ionicons name="alert-circle-outline" size={34} color={colors.accent} />
        <Text style={[styles.stateTitle, { color: colors.text }]}>Report unavailable</Text>
        <Text style={[styles.stateSub, { color: colors.sub }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={18} color={colors.accent} />
        <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
      </TouchableOpacity>

      <PageHeader
        title="Executive Report"
        subtitle="C-suite summary, evidence, classification detail, and corrective action status."
      />

      <AppCard style={styles.heroCard}>
        <View style={styles.reportHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.reportId, { color: colors.accent }]}>{report?.id}</Text>
            <Text style={[styles.reportTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.reportMeta, { color: colors.sub }]}>
              {report?.area || report?.siteName || 'Unassigned Area'} • {report?.eventTypeCode || 'Safety Report'}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor() }]} />
            <Text style={[styles.statusText, { color: colors.text }]}>{status}</Text>
          </View>
        </View>

        <View style={styles.executiveGrid}>
          <Metric label="Severity" value={severity} />
          <Metric label="Evidence" value={String(attachments.length)} />
          <Metric label="AI Findings" value={String(classifications.length)} />
          <Metric label="Actions" value={String(actions.length)} />
        </View>
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Executive Summary</Text>
        <Text style={[styles.bodyText, { color: colors.sub }]}>
          {report?.narrative || report?.hazardDescription || 'No executive summary has been provided for this report.'}
        </Text>
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Evidence</Text>

        {attachments.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.sub }]}>No evidence files attached.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
            {attachments.map((item: any, index: number) => (
              <Image
                key={`${item.id || index}`}
                source={{ uri: item.imageUri || item.uri }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        )}
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Classification</Text>

        {classifications.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.sub }]}>No AI classification records available.</Text>
        ) : (
          classifications.map((item: any, index: number) => (
            <View key={item.id || index} style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>
                {item.hazardCategory || item.standardCode || 'Classification'}
              </Text>
              <Text style={[styles.rowSub, { color: colors.sub }]}>
                Confidence: {item.confidenceScore ?? item.confidence ?? 'N/A'}
              </Text>
            </View>
          ))
        )}
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviewer Notes</Text>

        {reviews.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.sub }]}>No reviewer notes recorded.</Text>
        ) : (
          reviews.map((item: any, index: number) => (
            <View key={item.id || index} style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>
                {item.reviewStatus || 'Review'}
              </Text>
              <Text style={[styles.rowSub, { color: colors.sub }]}>
                {item.notes || item.comment || 'No notes provided.'}
              </Text>
            </View>
          ))
        )}
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Corrective Actions</Text>

        {actions.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.sub }]}>No corrective actions assigned.</Text>
        ) : (
          actions.map((item: any, index: number) => (
            <View key={item.id || index} style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>
                {item.title || item.actionTitle || 'Corrective Action'}
              </Text>
              <Text style={[styles.rowSub, { color: colors.sub }]}>
                {item.status || 'Open'} • {item.ownerName || 'Unassigned'}
              </Text>
            </View>
          ))
        )}
      </AppCard>

      <View style={styles.buttonRow}>
        <AppButton label="Export PDF" onPress={() => {}} style={{ flex: 1 }} />
        <AppButton label="Share Report" variant="secondary" onPress={() => {}} style={{ flex: 1 }} />
      </View>

      <AppFooter />
    </ScrollView>
  );

  function Metric({ label, value }: { label: string; value: string }) {
    return (
      <View style={[styles.metricCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.metricLabel, { color: colors.sub }]}>{label}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 120,
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
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: tokens.spacing.md,
  },
  backText: {
    fontSize: tokens.type.small,
    fontWeight: '800',
  },
  heroCard: {
    marginBottom: tokens.spacing.lg,
  },
  reportHeader: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.lg,
  },
  reportId: {
    fontSize: tokens.type.small,
    fontWeight: '900',
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 6,
  },
  reportMeta: {
    fontSize: tokens.type.small,
    fontWeight: '700',
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
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  executiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  metricCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  metricLabel: {
    marginTop: 4,
    fontSize: tokens.type.small,
    fontWeight: '700',
  },
  sectionCard: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '900',
    marginBottom: tokens.spacing.md,
  },
  bodyText: {
    fontSize: tokens.type.body,
    lineHeight: 22,
    fontWeight: '600',
  },
  imageRow: {
    gap: tokens.spacing.sm,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: tokens.radius.md,
  },
  row: {
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
  },
  rowTitle: {
    fontSize: tokens.type.body,
    fontWeight: '800',
    marginBottom: 4,
  },
  rowSub: {
    fontSize: tokens.type.small,
    lineHeight: 18,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
});
