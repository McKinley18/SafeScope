import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { apiClient } from '../../src/api/client';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const result = await apiClient.getNotifications();
    setItems(Array.isArray(result) ? result : []);
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await apiClient.markNotificationRead(id);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader title="Notifications" subtitle="Assignments, reminders, overdue actions, and alerts." />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : items.length === 0 ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.sub }]}>No notifications.</Text>
        </View>
      ) : (
        items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: item.read ? colors.border : colors.accent,
              },
            ]}
            onPress={() => markRead(item.id)}
          >
            <View style={styles.row}>
              <Ionicons
                name={item.read ? 'mail-open-outline' : 'notifications-outline'}
                size={18}
                color={colors.accent}
              />
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            </View>

            <Text style={[styles.message, { color: colors.sub }]}>{item.message}</Text>

            <Text style={[styles.time, { color: colors.sub }]}>
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
            </Text>
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
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    flex: 1,
  },
  message: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  time: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
