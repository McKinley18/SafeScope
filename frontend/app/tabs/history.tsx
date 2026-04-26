import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

      const res = await apiClient.getReports({
        page: 1,
        limit: 100,
      });

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

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const q = search.toLowerCase();

      const matchesSearch =
        !q ||
        String(r.title || '').toLowerCase().includes(q) ||
        String(r.hazardDescription || '').toLowerCase().includes(q) ||
        String(r.area || '').toLowerCase().includes(q);

      const matchesSeverity =
        severity === 'all' ||
        String(r.severity || '').toLowerCase() === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [reports, search, severity]);

  const stats = useMemo(() => {
    const total = reports.length;
    const critical = reports.filter((r) =>
      ['critical', 'high'].includes(String(r.severity || '').toLowerCase())
    ).length;

    const open = reports.filter((r) =>
      ['submitted', 'draft', 'pending'].includes(
        String(r.reportStatus || '').toLowerCase()
      )
    ).length;

    return { total, critical, open };
  }, [reports]);

  const severityColor = (sev?: string) => {
    const s = String(sev || '').toLowerCase();
    if (s === 'critical') return '#ef4444';
    if (s === 'high') return '#f97316';
    if (s === 'medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Records Center"
        subtitle="Search inspections, findings, trends, and historical reports."
      />

      <View style={styles.kpiRow}>
        {[
          ['Reports', stats.total, 'documents-outline'],
          ['Open', stats.open, 'time-outline'],
          ['High Risk', stats.critical, 'warning-outline'],
        ].map(([label, value, icon]) => (
          <AppCard key={String(label)} style={styles.kpiCard}>
            <Ionicons name={icon as any} size={18} color={colors.accent} />
            <Text style={[styles.kpiValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.sub }]}>{label}</Text>
          </AppCard>
        ))}
      </View>

      <View
        style={[
          styles.searchWrap,
          { backgroundColor: colors.cardAlt, borderColor: colors.border },
        ]}
      >
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
              <Text
                style={[
                  styles.filterText,
                  { color: active ? '#fff' : colors.text },
                ]}
              >
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
            No matching reports found.
          </Text>
        </AppCard>
      ) : (
        filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/tabs/report?id=${item.id}` as any)}
          >
            <AppCard style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {item.title || item.hazardDescription || 'Inspection Report'}
                  </Text>

                  <Text style={[styles.cardMeta, { color: colors.sub }]}>
                    {item.area || 'No area'} •{' '}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : 'No date'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: severityColor(item.severity) },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {String(item.severity || 'low').toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={[styles.statusLine, { color: colors.sub }]}>
                Status: {item.reportStatus || 'unknown'}
              </Text>
            </AppCard>
          </TouchableOpacity>
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

  center: {
    paddingTop: 80,
    alignItems: 'center',
  },

  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },

  kpiCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },

  kpiValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: '900',
  },

  kpiLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '800',
  },

  searchWrap: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  filterText: {
    fontSize: 10,
    fontWeight: '900',
  },

  card: {
    marginBottom: 10,
  },

  cardTop: {
    flexDirection: 'row',
    gap: 8,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 5,
  },

  cardMeta: {
    fontSize: 12,
    fontWeight: '700',
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },

  statusLine: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
