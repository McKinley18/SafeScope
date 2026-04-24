import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import PageHeader from '../../src/components/ui/PageHeader';
import AppFooter from '../../src/components/ui/AppFooter';
import { apiClient } from '../../src/api/client';

type QueueItem = {
  id: string;
  title?: string;
  hazardDescription?: string;
  narrative?: string;
  area?: string;
  severity?: string;
  reportStatus?: string;
  confidenceScore?: number;
  reportedDatetime?: string;
  createdAt?: string;
  attachments?: any[];
};

export default function ReviewScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string>('');

  const loadQueue = async () => {
    try {
      setLoading(true);

      const res = await apiClient.getReports({
        page: 1,
        limit: 50,
        status: 'submitted',
      });

      const rows = Array.isArray(res) ? res : res?.data || [];
      setQueue(rows);
    } catch (e) {
      console.error(e);
      Alert.alert('Unable to load queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const updateStatus = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      setUpdatingId(id);
      await apiClient.decideReview(id, { decision });
      await loadQueue();
    } catch {
      Alert.alert('Update failed');
    } finally {
      setUpdatingId('');
    }
  };

  const highRiskCount = useMemo(() => {
    return queue.filter((item) => {
      const sev = String(item.severity || '').toLowerCase();
      return sev === 'high' || sev === 'critical';
    }).length;
  }, [queue]);

  const severityColor = (severity?: string) => {
    const sev = String(severity || '').toLowerCase();
    if (sev === 'critical') return '#ef4444';
    if (sev === 'high') return '#f97316';
    if (sev === 'medium') return '#f59e0b';
    return '#10b981';
  };

  const getTitle = (item: QueueItem) =>
    item.title || item.hazardDescription || item.narrative || 'Safety Report';

  const getAge = (item: QueueItem) => {
    const raw = item.reportedDatetime || item.createdAt;
    if (!raw) return 'New';

    const then = new Date(raw).getTime();
    if (Number.isNaN(then)) return 'New';

    const minutes = Math.max(1, Math.round((Date.now() - then) / 60000));
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    return `${Math.round(hours / 24)} day ago`;
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <PageHeader
        title="AI Decision Queue"
        subtitle="Submitted reports awaiting supervisory approval, rejection, or escalation."
      />

      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{queue.length}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Pending</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{highRiskCount}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>High Risk</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>Live</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Queue</Text>
        </AppCard>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Submitted Reports</Text>

        <TouchableOpacity
          onPress={loadQueue}
          style={[styles.refreshButton, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.text} />
          <Text style={[styles.refreshText, { color: colors.text }]}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : queue.length === 0 ? (
        <AppCard>
          <Ionicons name="checkmark-circle-outline" size={28} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No pending reviews</Text>
          <Text style={[styles.empty, { color: colors.sub }]}>
            No reports are waiting for review. Submit a hazard from Inspect and it will appear here automatically.
          </Text>
          <AppButton
            label="Start Inspection"
            onPress={() => router.push('/tabs/camera')}
            style={styles.emptyButton}
          />
        </AppCard>
      ) : (
        queue.map((item) => {
          const evidenceCount = item.attachments?.length || 0;
          const severity = item.severity || 'low';
          const updating = updatingId === item.id;

          return (
            <AppCard key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    {getTitle(item)}
                  </Text>

                  <Text style={[styles.meta, { color: colors.sub }]}>
                    {item.id} • {item.area || 'Unassigned Area'} • {getAge(item)}
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: severityColor(severity) }]}>
                  <Text style={styles.badgeText}>{String(severity).toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={[styles.infoPill, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Ionicons name="image-outline" size={15} color={colors.accent} />
                  <Text style={[styles.infoText, { color: colors.text }]}>{evidenceCount} Evidence</Text>
                </View>

                <View style={[styles.infoPill, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Ionicons name="analytics-outline" size={15} color={colors.accent} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    {item.confidenceScore ? `${Math.round(item.confidenceScore)}% AI` : 'AI Pending'}
                  </Text>
                </View>

                <View style={[styles.infoPill, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Ionicons name="time-outline" size={15} color={colors.accent} />
                  <Text style={[styles.infoText, { color: colors.text }]}>Submitted</Text>
                </View>
              </View>

              <Text style={[styles.summary, { color: colors.sub }]}>
                {item.narrative || item.hazardDescription || 'No additional narrative provided.'}
              </Text>

              <View style={styles.actions}>
                <AppButton
                  label={updating ? 'Updating…' : 'Approve'}
                  style={{ flex: 1 }}
                  onPress={() => updateStatus(item.id, 'approved')}
                />

                <AppButton
                  label="Reject"
                  variant="secondary"
                  style={{ flex: 1 }}
                  onPress={() => updateStatus(item.id, 'rejected')}
                />
              </View>

              <TouchableOpacity
                style={styles.detailLink}
                onPress={() => router.push(`/tabs/report?id=${item.id}` as any)}
              >
                <Text style={[styles.detailLinkText, { color: colors.accent }]}>
                  Open Executive Report
                </Text>
                <Ionicons name="arrow-forward-outline" size={16} color={colors.accent} />
              </TouchableOpacity>
            </AppCard>
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
  center: {
    paddingTop: 80,
    alignItems: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  kpiCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: tokens.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '900',
  },
  refreshButton: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    marginBottom: tokens.spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.sm,
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
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: tokens.spacing.md,
  },
  infoPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '800',
  },
  summary: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: tokens.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailLink: {
    marginTop: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLinkText: {
    fontSize: 13,
    fontWeight: '900',
  },
  emptyTitle: {
    marginTop: tokens.spacing.sm,
    fontSize: tokens.type.h2,
    fontWeight: '900',
  },
  empty: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  emptyButton: {
    marginTop: tokens.spacing.md,
  },
});
