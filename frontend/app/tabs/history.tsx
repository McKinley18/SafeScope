import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import { apiClient } from '../../src/api/client';
import AppCard from '../../src/components/ui/AppCard';
import BrandedHeader from '../../src/components/ui/BrandedHeader';

type ReportItem = {
  id: string;
  title?: string;
  hazardDescription?: string;
  area?: string;
  severity?: string;
  reportStatus?: string;
  createdAt?: string;
  reportedDatetime?: string;
};

export default function HistoryScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getReports({ page: 1, limit: 100, status: 'submitted' });
      setReports(Array.isArray(res) ? res : res?.data || []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const openExecutivePdf = async (id: string) => {
    const url = apiClient.getExecutivePdfUrl(id);
    await Linking.openURL(url);
  };

  const deleteReport = async (id: string) => {
    Alert.alert('Delete report?', 'This will remove the submitted report from Records.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await apiClient.deleteReport(id);
          await loadReports();
        },
      },
    ]);
  };

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        String(r.title || '').toLowerCase().includes(q) ||
        String(r.hazardDescription || '').toLowerCase().includes(q) ||
        String(r.area || '').toLowerCase().includes(q);

      const matchesSeverity =
        severity === 'all' || String(r.severity || '').toLowerCase() === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [reports, search, severity]);

  const stats = useMemo(() => {
    const total = reports.length;
    const critical = reports.filter((r) =>
      ['critical', 'high', '5'].includes(String(r.severity || '').toLowerCase())
    ).length;
    return { total, critical };
  }, [reports]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Records Center"
        subtitle="Submitted inspection reports only. Edit or delete completed reports here."
      />

      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Ionicons name="documents-outline" size={18} color={colors.accent} />
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>Submitted</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Ionicons name="warning-outline" size={18} color={colors.accent} />
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.critical}</Text>
          <Text style={[styles.kpiLabel, { color: colors.sub }]}>High Risk</Text>
        </AppCard>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.sub} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search area, title, hazard..."
          placeholderTextColor={colors.muted}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      <View style={styles.filterRow}>
        {['all', 'critical', 'high', 'medium', 'low'].map((item) => {
          const active = severity === item;
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? colors.accent : colors.cardAlt,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setSeverity(item)}
            >
              <Text style={[styles.filterText, { color: active ? '#fff' : colors.text }]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : filtered.length === 0 ? (
        <AppCard>
          <Text style={[styles.emptyText, { color: colors.sub }]}>
            No submitted reports found.
          </Text>
        </AppCard>
      ) : (
        filtered.map((item) => (
          <AppCard key={item.id} style={styles.reportCard}>
            <Text style={[styles.reportTitle, { color: colors.text }]}>
              {item.title || 'Inspection Report'}
            </Text>

            <Text style={[styles.reportText, { color: colors.sub }]}>
              {item.hazardDescription || 'No description'}
            </Text>

            <Text style={[styles.meta, { color: colors.sub }]}>
              Area: {item.area || 'N/A'} · Severity: {item.severity || 'N/A'}
            </Text>

            <Text style={[styles.meta, { color: colors.sub }]}>
              Date: {item.reportedDatetime ? new Date(item.reportedDatetime).toLocaleDateString('en-US') : 'N/A'}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#2563EB' }]}
                onPress={() => router.push(`/tabs/camera?reportId=${item.id}` as any)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]}
                onPress={() => deleteReport(item.id)}
              >
                <Text style={[styles.actionText, { color: '#991B1B' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </AppCard>
        ))
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
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  center: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: '700',
  },
  reportCard: {
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  reportText: {
    marginTop: 6,
    lineHeight: 20,
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
  },
});
