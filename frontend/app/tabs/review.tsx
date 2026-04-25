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
import { apiClient } from '../../src/api/client';

import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import AppFooter from '../../src/components/ui/AppFooter';
import BrandedHeader from '../../src/components/ui/BrandedHeader';

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

type ActionItem = {
  id: string;
  title?: string;
  priorityCode?: string;
  statusCode?: string;
  dueDate?: string;
};

export default function ReviewScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');

  const loadAll = async () => {
    try {
      setLoading(true);

      const reports = await apiClient.getReports({
        page: 1,
        limit: 50,
        status: 'submitted',
      });

      const corrective = await apiClient.getCorrectiveActions({
        page: 1,
        limit: 100,
      });

      setQueue(Array.isArray(reports) ? reports : reports?.data || []);
      setActions(Array.isArray(corrective) ? corrective : corrective?.data || []);
    } catch (e) {
      Alert.alert('Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const pendingReviews = queue.length;

  const openActions = useMemo(
    () => actions.filter((a) => a.statusCode !== 'closed').length,
    [actions]
  );

  const overdueActions = useMemo(
    () =>
      actions.filter((a) => {
        if (!a.dueDate) return false;
        if (a.statusCode === 'closed') return false;
        return new Date(a.dueDate).getTime() < Date.now();
      }).length,
    [actions]
  );

  const criticalItems = useMemo(
    () =>
      queue.filter((q) => {
        const sev = String(q.severity || '').toLowerCase();
        return sev === 'critical' || sev === 'high';
      }).length,
    [queue]
  );

  const updateStatus = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      setUpdatingId(id);
      await apiClient.decideReview(id, { decision });
      await loadAll();
    } catch {
      Alert.alert('Update failed');
    } finally {
      setUpdatingId('');
    }
  };

  const topQueue = queue.slice(0, 5);
  const topActions = actions
    .filter((a) => a.statusCode !== 'closed')
    .slice(0, 5);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Supervisor Cockpit"
        subtitle="Live operational oversight for reviews, actions, overdue work, and critical risk."
      />

      <View style={styles.kpiRow}>
        {[
          ['Pending Reviews', pendingReviews, 'shield-checkmark-outline'],
          ['Open Actions', openActions, 'construct-outline'],
          ['Overdue', overdueActions, 'time-outline'],
          ['Critical', criticalItems, 'warning-outline'],
        ].map(([label, value, icon]) => (
          <AppCard key={String(label)} style={styles.kpiCard}>
            <Ionicons name={icon as any} size={18} color={colors.accent} />
            <Text style={[styles.kpiValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.sub }]}>{label}</Text>
          </AppCard>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.refreshBar, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
        onPress={loadAll}
      >
        <Ionicons name="refresh-outline" size={18} color={colors.accent} />
        <Text style={[styles.refreshText, { color: colors.text }]}>Refresh Dashboard</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority Reviews</Text>

          {topQueue.length === 0 ? (
            <AppCard>
              <Text style={[styles.emptyText, { color: colors.sub }]}>
                No submitted reports awaiting review.
              </Text>
            </AppCard>
          ) : (
            topQueue.map((item) => (
              <AppCard key={item.id} style={styles.card}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title || item.hazardDescription || 'Safety Report'}
                </Text>

                <Text style={[styles.cardMeta, { color: colors.sub }]}>
                  {item.area || 'Unassigned Area'} • {String(item.severity || 'low').toUpperCase()}
                </Text>

                <View style={styles.actionRow}>
                  <AppButton
                    label={updatingId === item.id ? 'Updating…' : 'Approve'}
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
              </AppCard>
            ))
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Open Corrective Actions</Text>

          {topActions.length === 0 ? (
            <AppCard>
              <Text style={[styles.emptyText, { color: colors.sub }]}>
                No open corrective actions.
              </Text>
            </AppCard>
          ) : (
            topActions.map((item) => (
              <AppCard key={item.id} style={styles.card}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title || 'Corrective Action'}
                </Text>

                <Text style={[styles.cardMeta, { color: colors.sub }]}>
                  {item.priorityCode || 'standard'} • Due{' '}
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString()
                    : 'Not set'}
                </Text>
              </AppCard>
            ))
          )}

          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={[styles.quickLink, { backgroundColor: colors.card }]}
              onPress={() => router.push('/tabs/history')}
            >
              <Ionicons name="documents-outline" size={18} color={colors.accent} />
              <Text style={[styles.quickText, { color: colors.text }]}>Open Records</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickLink, { backgroundColor: colors.card }]}
              onPress={() => router.push('/tabs/camera')}
            >
              <Ionicons name="camera-outline" size={18} color={colors.accent} />
              <Text style={[styles.quickText, { color: colors.text }]}>Start Inspection</Text>
            </TouchableOpacity>
          </View>
        </>
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
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },

  kpiCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 14,
  },

  kpiValue: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '900',
  },

  kpiLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },

  refreshBar: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },

  refreshText: {
    fontSize: 13,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
  },

  card: {
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },

  cardMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },

  quickLinks: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },

  quickLink: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  quickText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
