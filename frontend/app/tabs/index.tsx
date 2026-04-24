import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppFooter from '../../src/components/ui/AppFooter';
import LegalDisclaimer from '../../components/LegalDisclaimer';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const quick = [
    { title: 'Start Inspection', icon: 'camera-outline', route: '/tabs/camera' },
    { title: 'Pending Reviews', icon: 'shield-checkmark-outline', route: '/tabs/review' },
    { title: 'Reports Center', icon: 'document-text-outline', route: '/tabs/history' },
    { title: 'Control Center', icon: 'settings-outline', route: '/tabs/settings' },
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
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.subtitle, { color: colors.sub }]}>
          Enterprise Safety Intelligence Platform
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Launch</Text>

      <View style={styles.grid}>
        {quick.map((item) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => router.push(item.route as any)}
            style={{ width: '48%' }}
          >
            <AppCard style={styles.launchCard}>
              <Ionicons name={item.icon as any} size={24} color={colors.accent} />
              <Text style={[styles.launchTitle, { color: colors.text }]}>
                {item.title}
              </Text>
            </AppCard>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Operational Snapshot</Text>

      <View style={styles.grid}>
        {stats.map(([label, value]) => (
          <AppCard key={label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.sub }]}>{label}</Text>
          </AppCard>
        ))}
      </View>

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
    alignItems: 'center',
    paddingTop: 4,
    marginBottom: 24,
  },
  logo: {
    width: 265,
    height: 135,
    marginBottom: -12,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 0,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: 18,
  },
  launchCard: {
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  statCard: {
    width: '48%',
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
