import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import AppFooter from '../../src/components/ui/AppFooter';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import StatusPill from '../../src/components/ui/StatusPill';
import { apiClient } from '../../src/api/client';

type QueueItem = any;
type ActionItem = any;

export default function WorkScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [reviews, setReviews] = useState<QueueItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');

  const loadWork = async () => {
    try {
      setLoading(true);

      const [reviewRes, actionRes] = await Promise.all([
        apiClient.getReports({ page: 1, limit: 50, status: 'submitted' }),
        apiClient.getCorrectiveActions({ page: 1, limit: 50 }),
      ]);

      setReviews(Array.isArray(reviewRes) ? reviewRes : reviewRes?.data || []);
      setActions(Array.isArray(actionRes) ? actionRes : actionRes?.data || []);
    } catch (e) {
      console.error(e);
      Alert.alert('Unable to load work queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWork();
  }, []);

  const openActions = useMemo(
    () => actions.filter((item) => item.statusCode !== 'closed'),
    [actions]
  );

  const highRiskReviews = useMemo(
    () => reviews.filter((item) => ['high', 'critical'].includes(String(item.severity || '').toLowerCase())).length,
    [reviews]
  );

  const decide = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      setUpdatingId(id);
      await apiClient.decideReview(id, { decision });
      await loadWork();
    } catch {
      Alert.alert('Update failed');
    } finally {
      setUpdatingId('');
    }
  };

  const closeAction = async (id: string) => {
    try {
      setUpdatingId(id);
      await apiClient.closeCorrectiveAction(id, 'Closed from Sentinel Safety work queue.');
      await loadWork();
    } catch {
      Alert.alert('Unable to close action');
    } finally {
      setUpdatingId('');
    }
  };

  const getTitle = (item: any) =>
    item.title || item.hazardDescription || item.narrative || 'Safety Report';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Work Queue"
        subtitle="Review submitted reports and close corrective actions from one place."
      />

      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{reviews.length}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Reviews</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{openActions.length}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Open Actions</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{highRiskReviews}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>High Risk</Text>
        </AppCard>
      </View>

      <TouchableOpacity
        onPress={loadWork}
        style={[styles.refreshRow, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
      >
        <Ionicons name="refresh-outline" size={17} color={colors.accent} />
        <Text style={[styles.refreshText, { color: colors.text }]}>Refresh Work Queue</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Reviews</Text>

          {reviews.length === 0 ? (
            <AppCard style={styles.emptyCard}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No reports waiting for review</Text>
              <Text style={[styles.emptyText, { color: colors.sub }]}>
                Submitted inspection reports will appear here.
              </Text>
            </AppCard>
          ) : (
            reviews.map((item) => (
              <AppCard key={item.displayId || item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: colors.text }]}>{getTitle(item)}</Text>
                    <Text style={[styles.meta, { color: colors.sub }]}>
                      {item.displayId || item.id} • {item.area || 'Unassigned Area'}
                    </Text>
                  </View>
                  <StatusPill
                    label={item.severity || 'medium'}
                    tone={['high', 'critical'].includes(String(item.severity).toLowerCase()) ? 'danger' : 'warning'}
                  />
                </View>

                <Text style={[styles.description, { color: colors.sub }]}>
                  {item.narrative || item.hazardDescription || 'No summary provided.'}
                </Text>

                <View style={styles.actionRow}>
                  <AppButton
                    label={updatingId === item.id ? 'Updating…' : 'Approve'}
                    style={{ flex: 1 }}
                    onPress={() => decide(item.id, 'approved')}
                  />
                  <AppButton
                    label="Reject"
                    variant="secondary"
                    style={{ flex: 1 }}
                    onPress={() => decide(item.id, 'rejected')}
                  />
                </View>

                <TouchableOpacity
                  style={styles.detailLink}
                  onPress={() => router.push(`/tabs/report?id=${item.displayId || item.id}` as any)}
                >
                  <Text style={[styles.detailLinkText, { color: colors.accent }]}>Open Report</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color={colors.accent} />
                </TouchableOpacity>
              </AppCard>
            ))
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Corrective Actions</Text>

          {openActions.length === 0 ? (
            <AppCard style={styles.emptyCard}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No open corrective actions</Text>
              <Text style={[styles.emptyText, { color: colors.sub }]}>
                Approved findings can generate actions for closure tracking.
              </Text>
            </AppCard>
          ) : (
            openActions.map((action) => (
              <AppCard key={action.displayId || action.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: colors.text }]}>{action.title}</Text>
                    <Text style={[styles.meta, { color: colors.sub }]}>
                      Report {action.reportDisplayId || action.reportId} • Due {action.dueDate ? new Date(action.dueDate).toLocaleDateString() : 'Not set'}
                    </Text>
                  </View>
                  <StatusPill
                    label={action.priorityCode || 'medium'}
                    tone={['urgent', 'high'].includes(String(action.priorityCode).toLowerCase()) ? 'danger' : 'warning'}
                  />
                </View>

                <Text style={[styles.description, { color: colors.sub }]}>{action.description}</Text>

                <AppButton
                  label={updatingId === action.id ? 'Closing…' : 'Close Action'}
                  onPress={() => closeAction(action.id)}
                />
              </AppCard>
            ))
          )}
        </>
      )}

      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: tokens.spacing.md, paddingBottom: 20, flexGrow: 1 },
  center: { paddingTop: 80, alignItems: 'center' },
  screenHeader: { paddingTop: 4, paddingBottom: 18 },
  headerKicker: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  headerTitle: { fontSize: 36, fontWeight: '900', letterSpacing: -0.8 },
  headerSub: { marginTop: 6, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  kpiCard: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  kpiValue: { fontSize: 26, fontWeight: '900' },
  kpiLabel: { fontSize: 11, fontWeight: '800', marginTop: 4, textAlign: 'center' },
  refreshRow: { borderWidth: 1, borderRadius: 16, minHeight: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  refreshText: { fontSize: 13, fontWeight: '900' },
  sectionTitle: { fontSize: 22, fontWeight: '900', marginTop: 8, marginBottom: 10 },
  card: { marginBottom: tokens.spacing.md },
  emptyCard: { marginBottom: tokens.spacing.lg },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm },
  title: { fontSize: 17, fontWeight: '900', marginBottom: 5, lineHeight: 22 },
  meta: { fontSize: 12, fontWeight: '700', lineHeight: 18 },
  description: { fontSize: 13, lineHeight: 19, fontWeight: '700', marginBottom: tokens.spacing.md },
  actionRow: { flexDirection: 'row', gap: tokens.spacing.sm },
  detailLink: { marginTop: tokens.spacing.md, flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailLinkText: { fontSize: 13, fontWeight: '900' },
  emptyTitle: { fontSize: 17, fontWeight: '900', marginBottom: 6 },
  emptyText: { fontSize: 13, lineHeight: 19, fontWeight: '700' },
});
