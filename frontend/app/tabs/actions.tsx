import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import AppFooter from '../../src/components/ui/AppFooter';
import { apiClient } from '../../src/api/client';

type ActionItem = {
  id: string;
  reportId: string;
  title: string;
  description: string;
  priorityCode: string;
  statusCode: string;
  dueDate?: string;
  createdAt?: string;
};

export default function ActionsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState('');

  const loadActions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getCorrectiveActions({ page: 1, limit: 100 });
      setActions(Array.isArray(res) ? res : res?.data || []);
    } catch {
      Alert.alert('Unable to load corrective actions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  const stats = useMemo(() => {
    const open = actions.filter((a) => a.statusCode === 'open').length;
    const closed = actions.filter((a) => a.statusCode === 'closed').length;
    const overdue = actions.filter((a) => {
      if (!a.dueDate || a.statusCode === 'closed') return false;
      return new Date(a.dueDate).getTime() < Date.now();
    }).length;

    return { total: actions.length, open, closed, overdue };
  }, [actions]);

  const priorityColor = (priority: string) => {
    if (priority === 'urgent') return '#ef4444';
    if (priority === 'high') return '#f97316';
    if (priority === 'medium') return '#f59e0b';
    return '#10b981';
  };

  const closeAction = async (id: string) => {
    try {
      setClosingId(id);
      await apiClient.closeCorrectiveAction(id, 'Closed from Sentinel Safety corrective action dashboard.');
      await loadActions();
    } catch {
      Alert.alert('Unable to close action');
    } finally {
      setClosingId('');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={18} color={colors.accent} />
        <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
      </TouchableOpacity>

      <BrandedHeader
        title="Work Actions"
        subtitle="Track ownership, due dates, overdue items, and closure progress."
      />

      <View style={styles.kpiRow}>
        {[
          ['Total', stats.total],
          ['Open', stats.open],
          ['Overdue', stats.overdue],
          ['Closed', stats.closed],
        ].map(([label, value]) => (
          <AppCard key={label} style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.sub }]}>{label}</Text>
          </AppCard>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : actions.length === 0 ? (
        <AppCard>
          <Ionicons name="construct-outline" size={28} color={colors.accent} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No corrective actions yet</Text>
          <Text style={[styles.emptyText, { color: colors.sub }]}>
            Approved reports can generate corrective actions for closure tracking.
          </Text>
        </AppCard>
      ) : (
        actions.map((action) => (
          <AppCard key={action.displayId || action.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>{action.title}</Text>
                <Text style={[styles.meta, { color: colors.sub }]}>
                  Report {action.reportDisplayId || action.reportId} • Due {action.dueDate ? new Date(action.dueDate).toLocaleDateString() : 'Not set'}
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: priorityColor(action.priorityCode) }]}>
                <Text style={styles.badgeText}>{action.priorityCode.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.sub }]}>{action.description}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.statusPill, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
              >
                <View style={[styles.dot, { backgroundColor: action.statusCode === 'closed' ? '#10b981' : colors.accent }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>{action.statusCode}</Text>
              </TouchableOpacity>

              {action.statusCode !== 'closed' && (
                <AppButton
                  label={closingId === action.id ? 'Closing…' : 'Close Action'}
                  onPress={() => closeAction(action.id)}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </AppCard>
        ))
      )}

      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: tokens.spacing.md, paddingBottom: 20, flexGrow: 1 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: tokens.spacing.md },
  backText: { fontSize: tokens.type.small, fontWeight: '800' },
  center: { paddingTop: 80, alignItems: 'center' },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm, marginBottom: tokens.spacing.lg },
  kpiCard: { width: '48%', alignItems: 'center', paddingVertical: tokens.spacing.md },
  kpiValue: { fontSize: 24, fontWeight: '900' },
  kpiLabel: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  card: { marginBottom: tokens.spacing.md },
  cardTop: { flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md },
  title: { fontSize: 17, fontWeight: '900', marginBottom: 5 },
  meta: { fontSize: 12, fontWeight: '700', lineHeight: 18 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  description: { fontSize: 13, lineHeight: 19, fontWeight: '600', marginBottom: tokens.spacing.md },
  actionRow: { flexDirection: 'row', gap: tokens.spacing.sm, alignItems: 'center' },
  statusPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 999 },
  statusText: { fontSize: 11, fontWeight: '900', textTransform: 'capitalize' },
  emptyTitle: { marginTop: tokens.spacing.sm, fontSize: tokens.type.h2, fontWeight: '900' },
  emptyText: { marginTop: 6, fontSize: 14, lineHeight: 20, fontWeight: '600' },
});
