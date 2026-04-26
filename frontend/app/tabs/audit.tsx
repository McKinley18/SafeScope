import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { apiClient } from '../../src/api/client';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';

export default function AuditScreen() {
  const { colors } = useAppTheme();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getAuditLogs();
      setLogs(Array.isArray(result) ? result : result?.data || result || []);
    } catch {
      Alert.alert('Unable to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader title="Audit Logs" subtitle="Review recent workspace activity and administrative events." />

      <TouchableOpacity
        style={[styles.refreshBar, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
        onPress={loadLogs}
      >
        <Ionicons name="refresh-outline" size={18} color={colors.accent} />
        <Text style={[styles.refreshText, { color: colors.text }]}>Refresh Logs</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : logs.length === 0 ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.sub }]}>No audit events found.</Text>
        </View>
      ) : (
        logs.map((log) => (
          <View key={log.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>{log.actionCode || 'Audit Event'}</Text>
            <Text style={[styles.eventMeta, { color: colors.sub }]}>
              {log.entityType || 'Entity'} • {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Unknown time'}
            </Text>
            <Text style={[styles.eventSmall, { color: colors.sub }]}>
              Actor: {log.actorUserId || 'System'} 
            </Text>
            <Text style={[styles.eventSmall, { color: colors.sub }]}>
              Entity: {log.entityId || 'N/A'}
            </Text>
          </View>
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
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },
  eventMeta: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  eventSmall: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
