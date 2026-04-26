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
import BrandedHeader from '../../src/components/ui/BrandedHeader';

type QueueItem = {
  id: string;
  title?: string;
  hazardDescription?: string;
  area?: string;
  severity?: string;
};

type ActionItem = {
  id: string;
  title?: string;
  description?: string;
  priorityCode?: string;
  statusCode?: 'open' | 'in_progress' | 'closed' | 'cancelled';
  dueDate?: string;
  assignedToName?: string;
  assignedToUserId?: string;
};

type Filter = 'all' | 'assigned' | 'overdue' | 'due_soon' | 'completed';

export default function ReviewScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [assignedActions, setAssignedActions] = useState<ActionItem[]>([]);
  const [filter, setFilter] = useState<Filter>('assigned');
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

      const mine = await apiClient.getCorrectiveActions({
        page: 1,
        limit: 100,
        assignedToMe: true,
      });

      setQueue(Array.isArray(reports) ? reports : reports?.data || []);
      setActions(Array.isArray(corrective) ? corrective : corrective?.data || []);
      setAssignedActions(Array.isArray(mine) ? mine : mine?.data || []);
    } catch {
      Alert.alert('Unable to load work queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const isClosed = (a: ActionItem) => a.statusCode === 'closed' || a.statusCode === 'cancelled';

  const isOverdue = (a: ActionItem) => {
    if (!a.dueDate || isClosed(a)) return false;
    return new Date(a.dueDate).getTime() < Date.now();
  };

  const isDueSoon = (a: ActionItem) => {
    if (!a.dueDate || isClosed(a)) return false;
    const due = new Date(a.dueDate).getTime();
    const now = Date.now();
    const threeDays = 1000 * 60 * 60 * 24 * 3;
    return due >= now && due <= now + threeDays;
  };

  const pendingReviews = queue.length;

  const openActions = useMemo(
    () => actions.filter((a) => !isClosed(a)).length,
    [actions]
  );

  const overdueActions = useMemo(
    () => actions.filter(isOverdue).length,
    [actions]
  );

  const dueSoonActions = useMemo(
    () => actions.filter(isDueSoon).length,
    [actions]
  );

  const visibleActions = useMemo(() => {
    if (filter === 'assigned') return assignedActions.filter((a) => !isClosed(a));
    if (filter === 'overdue') return actions.filter(isOverdue);
    if (filter === 'due_soon') return actions.filter(isDueSoon);
    if (filter === 'completed') return actions.filter(isClosed);
    return actions;
  }, [actions, assignedActions, filter]);

  const updateActionStatus = async (
    id: string,
    statusCode: 'open' | 'in_progress' | 'closed' | 'cancelled'
  ) => {
    try {
      setUpdatingId(id);
      await apiClient.updateCorrectiveActionStatus(id, { statusCode });
      await loadAll();
    } catch {
      Alert.alert('Update failed', 'Unable to update corrective action status.');
    } finally {
      setUpdatingId('');
    }
  };

  const updateReview = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      setUpdatingId(id);
      await apiClient.decideReview(id, { decision });
      await loadAll();
    } catch {
      Alert.alert('Review update failed');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Work Queue"
        subtitle="Track assigned corrective actions, due work, overdue items, and submitted reports."
      />

      <View style={styles.kpiRow}>
        {[
          ['Assigned to Me', assignedActions.filter((a) => !isClosed(a)).length, 'person-outline'],
          ['Open Actions', openActions, 'construct-outline'],
          ['Due Soon', dueSoonActions, 'calendar-outline'],
          ['Overdue', overdueActions, 'time-outline'],
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
        <Text style={[styles.refreshText, { color: colors.text }]}>Refresh Work Queue</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Corrective Actions</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {[
              ['assigned', 'Assigned to Me'],
              ['all', 'All Open'],
              ['due_soon', 'Due Soon'],
              ['overdue', 'Overdue'],
              ['completed', 'Completed'],
            ].map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterPill,
                  {
                    borderColor: filter === key ? colors.accent : colors.border,
                    backgroundColor: filter === key ? 'rgba(249,115,22,0.14)' : colors.cardAlt,
                  },
                ]}
                onPress={() => setFilter(key as Filter)}
              >
                <Text style={[styles.filterText, { color: colors.text }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {visibleActions.length === 0 ? (
            <AppCard>
              <Text style={[styles.emptyText, { color: colors.sub }]}>
                No corrective actions in this view.
              </Text>
            </AppCard>
          ) : (
            visibleActions.map((item) => (
              <AppCard key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      {item.title || 'Corrective Action'}
                    </Text>

                    <Text style={[styles.cardMeta, { color: colors.sub }]}>
                      {String(item.priorityCode || 'standard').toUpperCase()} •{' '}
                      {item.statusCode || 'open'} • Assigned to {item.assignedToName || 'Unassigned'}
                    </Text>

                    <Text style={[styles.cardMeta, { color: isOverdue(item) ? '#ef4444' : colors.sub }]}>
                      Due {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Not set'}
                    </Text>
                  </View>
                </View>

                {item.description ? (
                  <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
                ) : null}

                <View style={styles.actionRow}>
                  <AppButton
                    label={updatingId === item.id ? 'Updating…' : 'Start'}
                    variant="secondary"
                    style={{ flex: 1 }}
                    onPress={() => updateActionStatus(item.id, 'in_progress')}
                  />

                  <AppButton
                    label="Complete"
                    style={{ flex: 1 }}
                    onPress={() => updateActionStatus(item.id, 'closed')}
                  />
                </View>
              </AppCard>
            ))
          )}

          <Text style={[styles.sectionTitle, styles.sectionGap, { color: colors.text }]}>Submitted Reports</Text>

          {pendingReviews === 0 ? (
            <AppCard>
              <Text style={[styles.emptyText, { color: colors.sub }]}>
                No submitted reports awaiting review.
              </Text>
            </AppCard>
          ) : (
            queue.slice(0, 5).map((item) => (
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
                    onPress={() => updateReview(item.id, 'approved')}
                  />

                  <AppButton
                    label="Reject"
                    variant="secondary"
                    style={{ flex: 1 }}
                    onPress={() => updateReview(item.id, 'rejected')}
                  />
                </View>
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
              <Ionicons name="search-outline" size={18} color={colors.accent} />
              <Text style={[styles.quickText, { color: colors.text }]}>Start Inspection</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 120,
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
    paddingVertical: 22,
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
  sectionGap: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
  },
  filters: {
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '900',
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 5,
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
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
    paddingVertical: 22,
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
