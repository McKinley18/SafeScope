import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import PageHeader from '../../src/components/ui/PageHeader';
import AppFooter from '../../src/components/ui/AppFooter';
import { apiClient } from '../../src/api/client';

export default function ReviewScreen() {
  const { colors } = useAppTheme();

  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    try {
      setLoading(true);

      const res = await apiClient.getReports({
        page: 1,
        limit: 25,
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

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.updateReport(id, { reportStatus: status });
      loadQueue();
    } catch {
      Alert.alert('Update failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <PageHeader
        title="AI Decision Queue"
        subtitle="Submitted reports awaiting approval."
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : queue.length === 0 ? (
        <AppCard>
          <Text style={[styles.empty, { color: colors.text }]}>
            No submitted reports in queue.
          </Text>
        </AppCard>
      ) : (
        queue.map((item) => (
          <AppCard key={item.id} style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>
              {item.title || item.hazardDescription || 'Safety Report'}
            </Text>

            <Text style={[styles.meta, { color: colors.sub }]}>
              {item.id} • {item.area || 'Unassigned'}
            </Text>

            <View style={styles.actions}>
              <AppButton
                label="Approve"
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
      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
    flexGrow: 1,
  },
  center: {
    paddingTop: 80,
    alignItems: 'center',
  },
  card: {
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  empty: {
    fontSize: 15,
    fontWeight: '700',
  },
});
