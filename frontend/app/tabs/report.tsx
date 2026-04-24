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
import jsPDF from 'jspdf';

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


  const createCorrectiveAction = async () => {
    if (!report?.id) return;

    try {
      setCreatingAction(true);

      await apiClient.createCorrectiveAction({
        reportId: report.id,
        title: report.title || report.hazardDescription || 'Corrective Action',
        description:
          report.narrative ||
          report.hazardDescription ||
          'Generated from approved safety report.',
        priority:
          String(report.severity || '').toLowerCase() === 'critical'
            ? 'critical'
            : String(report.severity || '').toLowerCase() === 'high'
            ? 'high'
            : 'medium',
        ownerName: 'Unassigned',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      });

      Alert.alert('Corrective Action Created');
      loadReport();
    } catch (error) {
      Alert.alert('Unable to create corrective action');
    } finally {
      setCreatingAction(false);
    }
  };

  const exportExecutivePdf = async () => {
    const doc = new jsPDF();

    const safeText = (value: any, fallback = 'N/A') =>
      value === undefined || value === null || value === '' ? fallback : String(value);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const addFooter = () => {
      doc.setDrawColor(229, 231, 235);
      doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'SafeScope • Operational Safety Intelligence • Monolith Studios',
        14,
        pageHeight - 9
      );
      doc.text(`Generated ${new Date().toLocaleString()}`, pageWidth - 14, pageHeight - 9, {
        align: 'right',
      });
    };

    const addNewPageIfNeeded = (needed = 24) => {
      if (y + needed > pageHeight - 24) {
        addFooter();
        doc.addPage();
        y = 24;
      }
    };

    const imageToDataUrl = async (uri?: string) => {
      if (!uri || !/^https?:|^data:/.test(uri)) return null;

      try {
        if (uri.startsWith('data:')) return uri;
        const res = await fetch(uri);
        const blob = await res.blob();

        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch {
        return null;
      }
    };

    doc.setFillColor(16, 24, 40);
    doc.rect(0, 0, pageWidth, 38, 'F');

    try {
      const logoAsset = Image.resolveAssetSource(require('../../assets/images/logo.png'));
      const logoData = await imageToDataUrl(logoAsset?.uri);
      if (logoData) {
        doc.addImage(logoData, 'PNG', 12, 7, 34, 20);
      }
    } catch {}

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Safety Intelligence Report', 52, 16);

    doc.setTextColor(255, 106, 0);
    doc.setFontSize(10);
    doc.text('SafeScope Verified Report Package', 52, 26);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(safeText(title, 'Safety Report'), 14, 54, { maxWidth: 180 });

    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(255, 106, 0);
    doc.roundedRect(14, 64, pageWidth - 28, 38, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(154, 52, 18);
    doc.text(`Report ID: ${safeText(report?.id)}`, 20, 76);
    doc.text(`Status: ${safeText(status)}`, 20, 84);
    doc.text(`Severity: ${safeText(severity)}`, 20, 92);

    doc.text(`Area: ${safeText(report?.area || report?.siteName, 'Unassigned Area')}`, 108, 76);
    doc.text(`Type: ${safeText(report?.eventTypeCode, 'Safety Report')}`, 108, 84);
    doc.text(`Evidence Files: ${attachments.length}`, 108, 92);

    let y = 118;

    const section = (heading: string, lines: string[]) => {
      addNewPageIfNeeded(26);

      doc.setTextColor(17, 24, 39);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(heading, 14, y);
      y += 8;

      doc.setDrawColor(255, 106, 0);
      doc.setLineWidth(0.4);
      doc.line(14, y - 3, 54, y - 3);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);

      if (!lines.length) {
        doc.text('No records available.', 14, y);
        y += 10;
        return;
      }

      lines.forEach((line) => {
        addNewPageIfNeeded(16);
        const wrapped = doc.splitTextToSize(`• ${line}`, 178);
        doc.text(wrapped, 14, y);
        y += wrapped.length * 6 + 2;
      });

      y += 4;
    };

    const summary = safeText(
      report?.narrative || report?.hazardDescription,
      'No executive summary has been provided for this report.'
    );

    section('Executive Summary', [summary]);

    section(
      'AI Classification',
      classifications.map((item: any) =>
        safeText(item.hazardCategory || item.standardCode || item.classificationType || 'Classification')
      )
    );

    section(
      'Reviewer Notes',
      reviews.map((item: any) =>
        safeText(item.notes || item.comment || item.reviewStatus || 'Review record')
      )
    );

    section(
      'Corrective Actions',
      actions.map((item: any) =>
        `${safeText(item.title || item.actionTitle, 'Corrective Action')} - ${safeText(item.status, 'Open')}`
      )
    );

    addNewPageIfNeeded(60);
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Evidence', 14, y);
    y += 10;

    if (!attachments.length) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text('No evidence files attached.', 14, y);
      y += 10;
    } else {
      let x = 14;
      for (let index = 0; index < attachments.length; index++) {
        const item = attachments[index];
        const uri = item.imageUri || item.uri;
        const imgData = await imageToDataUrl(uri);

        addNewPageIfNeeded(62);

        if (imgData) {
          try {
            doc.addImage(imgData, 'JPEG', x, y, 54, 42);
          } catch {
            try {
              doc.addImage(imgData, 'PNG', x, y, 54, 42);
            } catch {
              doc.text(`Evidence ${index + 1}: ${safeText(item.fileName || uri)}`, x, y + 8);
            }
          }
        } else {
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
          doc.text(`Evidence ${index + 1}`, x, y + 8);
          doc.text(safeText(item.fileName || uri), x, y + 15, { maxWidth: 52 });
        }

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Evidence ${index + 1}`, x, y + 48);

        x += 62;
        if (x > pageWidth - 60) {
          x = 14;
          y += 58;
        }
      }

      y += 64;
    }

    addFooter();
    doc.save(`SafeScope-Executive-Report-${safeText(report?.id, 'export')}.pdf`);
  };

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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Review Decision</Text>

        <View style={[styles.decisionPanel, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor() }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              {report?.reviewDecision ? String(report.reviewDecision).toUpperCase() : 'No decision recorded'}
            </Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>
              {report?.reviewedAt ? `Reviewed ${new Date(report.reviewedAt).toLocaleString()}` : 'Awaiting supervisory review'}
            </Text>
          </View>
        </View>

        <Text style={[styles.bodyText, { color: colors.sub, marginTop: 12 }]}>
          {report?.reviewDecisionNotes || report?.notes || 'No reviewer notes recorded.'}
        </Text>
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Lifecycle Timeline</Text>

        <TimelineItem
          label="Report Created"
          value={report?.createdAt ? new Date(report.createdAt).toLocaleString() : 'Not recorded'}
          active
        />
        <TimelineItem
          label="Submitted for Review"
          value={String(report?.reportStatus || '').toLowerCase() !== 'draft' ? 'Submitted' : 'Not submitted'}
          active={String(report?.reportStatus || '').toLowerCase() !== 'draft'}
        />
        <TimelineItem
          label="Review Decision"
          value={report?.reviewDecision ? String(report.reviewDecision) : 'Pending'}
          active={!!report?.reviewDecision}
        />
        <TimelineItem
          label="Last Updated"
          value={report?.updatedAt ? new Date(report.updatedAt).toLocaleString() : 'Not recorded'}
          active={!!report?.updatedAt}
        />
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
        <AppButton label="Export PDF" onPress={exportExecutivePdf} style={{ flex: 1 }} />
        <AppButton label="Share Report" variant="secondary" onPress={() => {}} style={{ flex: 1 }} />
      </View>

      <AppFooter />
    </ScrollView>
  );

  function TimelineItem({
    label,
    value,
    active,
  }: {
    label: string;
    value: string;
    active: boolean;
  }) {
    return (
      <View style={styles.timelineRow}>
        <View
          style={[
            styles.timelineDot,
            { backgroundColor: active ? colors.accent : colors.border },
          ]}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.timelineLabel, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.timelineValue, { color: colors.sub }]}>{value}</Text>
        </View>
      </View>
    );
  }

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
  decisionPanel: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  timelineLabel: {
    fontSize: tokens.type.body,
    fontWeight: '900',
    marginBottom: 3,
  },
  timelineValue: {
    fontSize: tokens.type.small,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
});
