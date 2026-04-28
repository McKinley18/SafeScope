import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import { apiClient } from '../../src/api/client';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [acknowledgedPriority, setAcknowledgedPriority] = useState<string[]>([]);
  const [dismissedPriority, setDismissedPriority] = useState<string[]>([]);
  const [dashboard, setDashboard] = useState<any>({});

  useEffect(() => {
    apiClient.getDashboard().then(setDashboard).catch(() => setDashboard({}));
  }, []);

  const metrics = [
    ['Open Actions', String(dashboard.openActions ?? 0), 'construct-outline'],
    ['Overdue Actions', String(dashboard.overdueActions ?? 0), 'alert-circle-outline'],
    ['Pending Reviews', String(dashboard.reviewQueueCount ?? 0), 'shield-checkmark-outline'],
  ];

  const quickActions = [
    ['New Inspection', 'camera-outline', '/tabs/camera'],
    ['Add Action', 'add-circle-outline', '/tabs/actions'],
    ['View Reports', 'document-text-outline', '/tabs/report'],
    ['Open Vault', 'lock-closed-outline', '/tabs/vault'],
  ];

  const priorityItems = [
    {
      title: 'Repair damaged ladder',
      detail: 'High priority • Due Apr 28 • Awaiting owner acceptance',
      icon: 'warning-outline',
      severity: 'High',
      owner: 'Unassigned',
    },
    {
      title: 'Replace missing fire extinguisher',
      detail: 'Critical • In progress • Verification required',
      icon: 'flame-outline',
      severity: 'Critical',
      owner: 'Maintenance',
    },
    {
      title: 'No reports waiting longer than 24 hours',
      detail: 'Review queue clear • Monitor only',
      icon: 'checkmark-circle-outline',
      severity: 'Clear',
      owner: 'System',
    },
  ];


  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.brandHeader}>
        <Image
          source={require('../../assets/images/logo-final-navy-clean.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Command Center</Text>
        <Text style={[styles.slogan, { color: colors.accent }]}>See Risk. Prevent Harm.</Text>
        <Text style={[styles.pageSub, { color: colors.sub }]}>
          Operational safety overview, priority work, and field execution status.
        </Text>
      </View>

      <View style={styles.metrics}>
        {metrics.map(([label, value, icon]) => (
          <View key={label} style={[styles.metric, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name={icon as any} size={20} color={colors.accent} />
            <Text style={[styles.metricNum, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.metricLabel, { color: colors.sub }]}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Today’s Risk Snapshot</Text>

      <View style={[styles.snapshot, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.snapshotRow}>
          <Text style={[styles.snapshotLabel, { color: colors.sub }]}>Urgent actions</Text>
          <Text style={[styles.snapshotValue, { color: colors.text }]}>{dashboard.urgentActions ?? 0}</Text>
        </View>
        <View style={styles.snapshotRow}>
          <Text style={[styles.snapshotLabel, { color: colors.sub }]}>Overdue</Text>
          <Text style={[styles.snapshotValue, { color: colors.text }]}>{dashboard.overdueActions ?? 0}</Text>
        </View>
        <View style={styles.snapshotRow}>
          <Text style={[styles.snapshotLabel, { color: colors.sub }]}>Pending reviews</Text>
          <Text style={[styles.snapshotValue, { color: colors.text }]}>{dashboard.reviewQueueCount ?? 0}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

      <View style={styles.quickGrid}>
        {quickActions.map(([label, icon, route]) => (
          <TouchableOpacity
            key={label}
            style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(route as any)}
          >
            <Ionicons name={icon as any} size={22} color={colors.accent} />
            <Text style={[styles.quickText, { color: colors.text }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority Work Queue</Text>

      <View style={[styles.feed, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {priorityItems
          .filter((item) => !dismissedPriority.includes(item.title))
          .map((item) => {
            const acknowledged = acknowledgedPriority.includes(item.title);

            return (
              <View key={item.title} style={[styles.feedRow, { borderBottomColor: colors.border }]}>
                <Ionicons name={item.icon as any} size={20} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <View style={styles.feedHeaderRow}>
                    <Text style={[styles.feedText, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.statusPill, { color: acknowledged ? '#166534' : '#92400E' }]}>
                      {acknowledged ? 'Accepted' : 'Needs Review'}
                    </Text>
                  </View>

                  <Text style={[styles.feedDetail, { color: colors.sub }]}>{item.detail}</Text>
                  <Text style={[styles.feedDetail, { color: colors.sub }]}>
                    Severity: {item.severity} • Owner: {acknowledged ? 'You' : item.owner}
                  </Text>

                  <View style={styles.rowActions}>
                    <TouchableOpacity
                      style={[styles.smallBtnPrimary, { borderColor: colors.accent }]}
                      onPress={() =>
                        setAcknowledgedPriority(Array.from(new Set([...acknowledgedPriority, item.title])))
                      }
                    >
                      <Text style={styles.smallBtnPrimaryText}>
                        {acknowledged ? 'Accepted' : 'Accept / Start Review'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.smallBtn, { borderColor: colors.border }]}
                      onPress={() =>
                        Alert.alert(
                          'Close as not actionable?',
                          'Use this only for duplicate, invalid, already corrected, or non-applicable items. This action should be audit logged in production.',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Close',
                              style: 'destructive',
                              onPress: () => setDismissedPriority([...dismissedPriority, item.title]),
                            },
                          ],
                        )
                      }
                    >
                      <Text style={[styles.smallBtnText, { color: colors.sub }]}>Close as Not Actionable</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: 0,
    paddingBottom: 120,
    flexGrow: 1,
  },
  brandHeader: {
    backgroundColor: '#081827',
    marginHorizontal: -tokens.spacing.md,
    marginTop: 0,
    marginBottom: 20,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 520,
    height: 240,
  },
  titleBlock: {
    marginBottom: 22,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  slogan: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
  },
  pageSub: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    maxWidth: 430,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 4,
  },
  metrics: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  metric: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  metricNum: {
    marginTop: 6,
    fontSize: 27,
    fontWeight: '900',
  },
  metricLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  snapshot: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 22,
  },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  snapshotLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  snapshotValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  quickCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    minHeight: 92,
    justifyContent: 'center',
    gap: 10,
  },
  quickText: {
    fontSize: 14,
    fontWeight: '900',
  },
  feed: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  feedText: {
    fontSize: 14,
    fontWeight: '900',
  },
  feedDetail: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
  },
  activityPanel: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 14,
  },
  activityRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  activityDetail: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  smallBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnPrimary: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 40,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnText: {
    fontSize: 11,
    fontWeight: '900',
  },
  smallBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
});
