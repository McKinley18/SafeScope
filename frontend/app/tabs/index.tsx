import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/AppCard';
import AppFooter from '../../src/components/ui/AppFooter';
import LegalDisclaimer from '../../components/LegalDisclaimer';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const quick = [
    { title: 'Inspect', sub: 'Capture hazard evidence', icon: 'camera-outline', route: '/tabs/camera' },
    { title: 'Review', sub: 'Approve submitted reports', icon: 'shield-checkmark-outline', route: '/tabs/review' },
    { title: 'Reports', sub: 'Open executive records', icon: 'document-text-outline', route: '/tabs/history' },
    { title: 'Control', sub: 'Security and settings', icon: 'settings-outline', route: '/tabs/settings' },
  ];

  const stats = [
    ['Open Actions', '0'],
    ['Pending Reviews', '0'],
    ['Reports This Month', '0'],
    ['Risk Score', '0'],
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <LegalDisclaimer />

      <View style={styles.hero}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

        <Text style={[styles.heroKicker, { color: colors.accent }]}>Operational Safety Intelligence</Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>Command Center</Text>
        <Text style={[styles.heroSub, { color: colors.sub }]}>
          Inspect conditions, manage review workflow, and track safety execution from one secure workspace.
        </Text>
      </View>

      <View style={styles.grid}>
        {stats.map(([label, value]) => (
          <AppCard key={label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.sub }]}>{label}</Text>
          </AppCard>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Launch</Text>

      <View style={styles.grid}>
        {quick.map((item) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => router.push(item.route as any)}
            style={styles.launchWrap}
          >
            <AppCard style={styles.launchCard}>
              <View style={[styles.iconBadge, { backgroundColor: colors.cardAlt }]}>
                <Ionicons name={item.icon as any} size={24} color={colors.accent} />
              </View>
              <Text style={[styles.launchTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.launchSub, { color: colors.sub }]}>{item.sub}</Text>
            </AppCard>
          </TouchableOpacity>
        ))}
      </View>

      <AppCard style={styles.activityCard}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 0 }]}>Recent Activity</Text>
        <Text style={[styles.emptyText, { color: colors.sub }]}>
          Submit your first inspection to begin building the operational timeline.
        </Text>
      </AppCard>

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
  hero: {
    paddingTop: 0,
    paddingBottom: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 320,
    height: 150,
    marginBottom: -18,
  },
  heroKicker: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 7,
  },
  heroTitle: {
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  heroSub: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: 18,
  },
  statCard: {
    width: '48%',
    minHeight: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '900',
  },
  statLabel: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  launchWrap: {
    width: '48%',
  },
  launchCard: {
    minHeight: 150,
    justifyContent: 'center',
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  launchTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },
  launchSub: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  activityCard: {
    marginBottom: 18,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
});
