import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import PageHeader from '../../src/components/ui/PageHeader';
import AppFooter from '../../src/components/ui/AppFooter';
import { LocalVault, LocalVaultReport } from '../../src/storage/LocalVault';

export default function VaultScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [reports, setReports] = useState<LocalVaultReport[]>([]);

  const load = async () => {
    const rows = await LocalVault.getReports();
    setReports(rows);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteReport = async (id: string) => {
    Alert.alert('Delete local draft?', 'This removes the draft from this device only.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await LocalVault.deleteReport(id);
          await load();
        },
      },
    ]);
  };

  const statusColor = (status: string) => {
    if (status === 'synced') return '#10b981';
    if (status === 'pending_sync') return '#f59e0b';
    if (status === 'sync_failed') return '#ef4444';
    return colors.accent;
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={18} color={colors.accent} />
        <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
      </TouchableOpacity>

      <PageHeader
        title="Local Vault"
        subtitle="Recover drafts and device-saved inspections stored locally on this device."
      />

      {reports.length === 0 ? (
        <AppCard>
          <Ionicons name="file-tray-outline" size={28} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No local drafts</Text>
          <Text style={[styles.emptyText, { color: colors.sub }]}>
            Drafts created in Inspect will be saved here automatically.
          </Text>
        </AppCard>
      ) : (
        reports.map((report) => (
          <AppCard key={report.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {report.title || report.hazardDescription || 'Local Inspection Draft'}
                </Text>
                <Text style={[styles.meta, { color: colors.sub }]}>
                  {report.area || 'Unassigned Area'} • Updated {new Date(report.updatedAt).toLocaleString()}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: colors.cardAlt, borderColor: colors.border },
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: statusColor(report.syncStatus) }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>
                  {report.syncStatus.replace(/_/g, ' ')}
                </Text>
              </View>
            </View>

            <Text style={[styles.summary, { color: colors.sub }]}>
              {report.narrative || report.notes || report.hazardDescription || 'No summary entered yet.'}
            </Text>

            <View style={styles.metricRow}>
              <Text style={[styles.metric, { color: colors.text }]}>
                {report.evidence.length} evidence
              </Text>
              <Text style={[styles.metric, { color: colors.text }]}>
                {report.reportStatus}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.accent }]}
                onPress={() => router.push('/tabs/camera')}
              >
                <Text style={styles.primaryText}>Resume in Inspect</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.cardAlt, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => deleteReport(report.id)}
              >
                <Text style={[styles.secondaryText, { color: colors.text }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </AppCard>
        ))
      )}

      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 120,
    flexGrow: 1,
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
  card: {
    marginBottom: tokens.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 5,
  },
  meta: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
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
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  summary: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: tokens.spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  metric: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '900',
  },
  emptyTitle: {
    marginTop: tokens.spacing.sm,
    fontSize: tokens.type.h2,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
