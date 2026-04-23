import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import AppButton from '../../src/components/ui/AppButton';
import PageHeader from '../../src/components/ui/PageHeader';

type QueueItem = {
  id: string;
  title: string;
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
  summary: string;
};

const seedQueue: QueueItem[] = [
  {
    id: 'HZ-1042',
    title: 'Missing guard on conveyor tail pulley',
    area: 'Processing Area B',
    severity: 'high',
    confidence: 92,
    status: 'pending',
    summary: 'AI detected exposed pinch point near moving belt return.',
  },
  {
    id: 'HZ-1043',
    title: 'Blocked fire extinguisher access',
    area: 'Warehouse North',
    severity: 'medium',
    confidence: 87,
    status: 'pending',
    summary: 'Stored pallets obstruct emergency equipment clearance zone.',
  },
  {
    id: 'HZ-1044',
    title: 'Oil leak creating slip hazard',
    area: 'Crusher Platform',
    severity: 'critical',
    confidence: 95,
    status: 'pending',
    summary: 'Fluid accumulation visible on walking-working surface.',
  },
];

export default function ReviewScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [queue, setQueue] = useState<QueueItem[]>(seedQueue);
  const [selectedId, setSelectedId] = useState<string>(seedQueue[0].id);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => queue.find((q) => q.id === selectedId) || queue[0],
    [queue, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    setNotes('');
  }, [selectedId, selected]);

  const setStatus = async (status: QueueItem['status']) => {
    if (!selected) return;

    setLoading(true);

    setTimeout(() => {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === selected.id ? { ...item, status } : item
        )
      );
      setLoading(false);
      Alert.alert(
        status === 'approved' ? 'Finding Approved' : 'Finding Rejected',
        `${selected.id} has been updated.`
      );
    }, 600);
  };

  const pendingCount = queue.filter((q) => q.status === 'pending').length;
  const approvedCount = queue.filter((q) => q.status === 'approved').length;

  const severityColor = (sev: string) => {
    if (sev === 'critical') return '#ef4444';
    if (sev === 'high') return '#f97316';
    if (sev === 'medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <PageHeader
        eyebrow="Review Center"
        title="AI Decision Queue"
        subtitle="Validate findings, approve classifications, and accelerate closeout."
      />

      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{pendingCount}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Pending</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{approvedCount}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Approved</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{queue.length}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Total</Text>
        </AppCard>
      </View>

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Review Queue</Text>

        {queue.map((item) => {
          const active = item.id === selectedId;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.queueRow,
                {
                  backgroundColor: active ? colors.cardAlt : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedId(item.id)}
            >
              <View style={styles.queueMain}>
                <Text style={[styles.queueTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.queueMeta, { color: colors.sub }]}>
                  {item.id} • {item.area}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: severityColor(item.severity) },
                ]}
              >
                <Text style={styles.badgeText}>{item.severity.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </AppCard>

      {selected && (
        <AppCard style={styles.sectionCard}>
          <View style={styles.detailHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Finding Detail
              </Text>
              <Text style={[styles.detailMeta, { color: colors.sub }]}>
                {selected.id} • Confidence {selected.confidence}%
              </Text>
            </View>

            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={colors.accent}
            />
          </View>

          <Text style={[styles.detailTitle, { color: colors.text }]}>
            {selected.title}
          </Text>

          <Text style={[styles.detailBody, { color: colors.sub }]}>
            {selected.summary}
          </Text>

          <Text style={[styles.fieldLabel, { color: colors.sub }]}>
            Reviewer Notes
          </Text>

          <TextInput
            style={[
              styles.notesInput,
              {
                backgroundColor: colors.cardAlt,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            multiline
            placeholder="Add decision rationale, required actions, or comments"
            placeholderTextColor={colors.muted}
            value={notes}
            onChangeText={setNotes}
          />

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : (
            <View style={styles.actionRow}>
              <AppButton
                label="Approve"
                onPress={() => setStatus('approved')}
                style={{ flex: 1 }}
              />

              <AppButton
                label="Reject"
                variant="secondary"
                onPress={() => setStatus('rejected')}
                style={{ flex: 1 }}
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/tabs/history' as any)}
          >
            <Ionicons name="time-outline" size={16} color={colors.accent} />
            <Text style={[styles.linkText, { color: colors.accent }]}>
              Open Historical Trends
            </Text>
          </TouchableOpacity>
        </AppCard>
      )}
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
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  kpiCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '800',
    marginBottom: tokens.spacing.md,
  },
  queueRow: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  queueMain: {
    flex: 1,
  },
  queueTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  queueMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  detailMeta: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  detailBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: tokens.spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  notesInput: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  loadingWrap: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
  },
  linkRow: {
    marginTop: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
