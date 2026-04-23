import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LegalDisclaimer from '../../components/LegalDisclaimer';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import PageHeader from '../../src/components/ui/PageHeader';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://safescope-backend.onrender.com';
const ANALYTICS_CACHE_KEY = 'safescope_dashboard_cache';
const ANALYTICS_CACHE_TIME_KEY = 'safescope_dashboard_cache_time';

const kpis = [
  {
    label: 'Risk Index',
    value: '82',
    trend: '+4%',
    icon: 'shield-checkmark-outline' as const,
    help: 'Overall risk indicator based on open issues, severity, and action status.',
  },
  {
    label: 'Open Actions',
    value: '14',
    trend: '-2',
    icon: 'construct-outline' as const,
    help: 'Corrective actions still unresolved or awaiting verification.',
  },
  {
    label: 'Inspections',
    value: '27',
    trend: '+6',
    icon: 'document-text-outline' as const,
    help: 'Audit sessions started during the current month.',
  },
  {
    label: 'High-Risk',
    value: '5',
    trend: '-1',
    icon: 'warning-outline' as const,
    help: 'Findings marked severe, critical, or priority review.',
  },
];

const activity = [
  { title: 'North Plant audit published', meta: '12 minutes ago' },
  { title: '3 corrective actions overdue', meta: 'Processing Area B' },
  { title: 'Fall protection finding escalated', meta: 'South Mezzanine' },
];

export default function Home() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    const prefetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/overview`);
        if (!res.ok) return;
        const json = await res.json();
        await AsyncStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(json));
        await AsyncStorage.setItem(ANALYTICS_CACHE_TIME_KEY, new Date().toISOString());
      } catch {}
    };

    prefetchAnalytics();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
        <LegalDisclaimer onAccept={() => {}} />

        <AppCard style={styles.heroCard}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.brandSubtitle, { color: colors.sub }]}>
            Operational Safety Intelligence
          </Text>
        </AppCard>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Operational Snapshot</Text>
          <View style={styles.sectionHeaderRight}>
            <TouchableOpacity onPress={() => setInfoOpen(true)} style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
              <Text style={[styles.sectionLink, { color: colors.accent }]}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/tabs/analytics' as any)}>
              <Text style={[styles.sectionLink, { color: colors.accent }]}>Open Intelligence</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.kpiGrid}>
          {kpis.map((item) => (
            <AppCard key={item.label} style={styles.kpiCard}>
              <View style={styles.kpiTop}>
                <View style={[styles.kpiIconWrap, { backgroundColor: colors.cardAlt }]}>
                  <Ionicons name={item.icon} size={18} color={colors.accent} />
                </View>
                <Text style={[styles.kpiTrend, { color: colors.accent }]}>{item.trend}</Text>
              </View>
              <Text style={[styles.kpiValue, { color: colors.text }]}>{item.value}</Text>
              <Text style={[styles.kpiLabel, { color: colors.muted }]}>{item.label}</Text>
              <Text style={[styles.kpiHelp, { color: colors.sub }]}>{item.help}</Text>
            </AppCard>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        </View>

        <View style={styles.quickGrid}>
          <AppCard style={styles.quickCard}>
            <TouchableOpacity onPress={() => router.push('/tabs/review')}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
              <Text style={[styles.quickTitle, { color: colors.text }]}>Review Queue</Text>
              <Text style={[styles.quickSub, { color: colors.muted }]}>Validate AI findings</Text>
            </TouchableOpacity>
          </AppCard>

          <AppCard style={styles.quickCard}>
            <TouchableOpacity onPress={() => router.push('/tabs/analytics' as any)}>
              <Ionicons name="bar-chart-outline" size={20} color={colors.accent} />
              <Text style={[styles.quickTitle, { color: colors.text }]}>Executive Intelligence</Text>
              <Text style={[styles.quickSub, { color: colors.muted }]}>View trends and KPIs</Text>
            </TouchableOpacity>
          </AppCard>

          <AppCard style={styles.quickCard}>
            <TouchableOpacity onPress={() => router.push('/tabs/settings')}>
              <Ionicons name="options-outline" size={20} color={colors.accent} />
              <Text style={[styles.quickTitle, { color: colors.text }]}>Control</Text>
              <Text style={[styles.quickSub, { color: colors.muted }]}>Profile and defaults</Text>
            </TouchableOpacity>
          </AppCard>

          <AppCard style={styles.quickCard}>
            <TouchableOpacity onPress={() => router.push('/tabs/history' as any)}>
              <Ionicons name="documents-outline" size={20} color={colors.accent} />
              <Text style={[styles.quickTitle, { color: colors.text }]}>Reports</Text>
              <Text style={[styles.quickSub, { color: colors.muted }]}>Past audits and stats</Text>
            </TouchableOpacity>
          </AppCard>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        </View>

        <AppCard>
          {activity.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.activityRow,
                index < activity.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={[styles.activityDot, { backgroundColor: colors.accent }]} />
              <View style={styles.activityTextWrap}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.activityMeta, { color: colors.muted }]}>{item.meta}</Text>
              </View>
            </View>
          ))}
        </AppCard>
      </ScrollView>

      <Modal visible={infoOpen} transparent animationType="fade" onRequestClose={() => setInfoOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Operational Snapshot</Text>
              <TouchableOpacity onPress={() => setInfoOpen(false)}>
                <Ionicons name="close-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {kpis.map((item) => (
              <View key={item.label} style={styles.modalItem}>
                <Text style={[styles.modalItemTitle, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.modalItemText, { color: colors.sub }]}>{item.help}</Text>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    flexGrow: 1,
  },
  heroCard: {
    marginBottom: tokens.spacing.xl,
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  logoWrap: {
    marginBottom: tokens.spacing.md,
  },
  logo: {
    width: 250,
    height: 115,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginTop: tokens.spacing.sm,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: tokens.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '800',
  },
  sectionLink: {
    fontSize: tokens.type.small,
    fontWeight: '700',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xl,
  },
  kpiCard: {
    width: '48%',
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTrend: {
    fontSize: tokens.type.small,
    fontWeight: '800',
  },
  kpiValue: {
    marginTop: tokens.spacing.sm,
    fontSize: tokens.type.kpi,
    fontWeight: '800',
  },
  kpiLabel: {
    marginTop: 4,
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  kpiHelp: {
    marginTop: 6,
    fontSize: tokens.type.small,
    lineHeight: 18,
  },
  quickGrid: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xl,
  },
  quickCard: {
    paddingVertical: tokens.spacing.lg,
  },
  quickTitle: {
    marginTop: 10,
    fontSize: tokens.type.body,
    fontWeight: '800',
  },
  quickSub: {
    marginTop: 4,
    fontSize: tokens.type.small,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: tokens.spacing.md,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 6,
    marginRight: 12,
  },
  activityTextWrap: {
    flex: 1,
  },
  activityTitle: {
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  activityMeta: {
    marginTop: 4,
    fontSize: tokens.type.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  modalTitle: {
    fontSize: tokens.type.h1,
    fontWeight: '800',
  },
  modalItem: {
    marginTop: tokens.spacing.sm,
  },
  modalItemTitle: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalItemText: {
    fontSize: tokens.type.small,
    lineHeight: 18,
  },
});
