import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppFooter from '../../src/components/ui/AppFooter';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const actions = [
    ['Inspect', 'camera-outline', '/tabs/camera'],
    ['Work', 'shield-checkmark-outline', '/tabs/review'],
    ['Records', 'document-text-outline', '/tabs/history'],
    ['Control', 'settings-outline', '/tabs/settings'],
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.hero}>
        <Image
          source={require('../../assets/images/logo-header.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.heroTitle}>Command Center</Text>
        <Text style={styles.heroSub}>
          Inspect, review, report, and close safety work from one secure workspace.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

      <View style={styles.list}>
        {actions.map(([label, icon, route]) => (
          <TouchableOpacity
            key={label}
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={() => router.push(route as any)}
          >
            <Ionicons name={icon as any} size={22} color={colors.accent} />
            <Text style={[styles.rowText, { color: colors.text }]}>{label}</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.muted} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Today</Text>

      <View style={styles.metrics}>
        {['Open Actions', 'Pending Reviews', 'High Risk'].map((item) => (
          <View key={item} style={[styles.metric, { backgroundColor: colors.card }]}>
            <Text style={[styles.metricNum, { color: colors.text }]}>0</Text>
            <Text style={[styles.metricLabel, { color: colors.sub }]}>{item}</Text>
          </View>
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
    backgroundColor: '#0b1120',
    marginHorizontal: -tokens.spacing.md,
    marginTop: -tokens.spacing.md,
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: tokens.spacing.md,
    marginBottom: 24,
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 185,
    maxWidth: 820,
    marginBottom: -20,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -0.9,
    textAlign: 'center',
  },
  heroSub: {
    color: '#CBD5E1',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 360,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 14,
  },
  list: {
    marginBottom: 24,
  },
  row: {
    minHeight: 64,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  metrics: {
    flexDirection: 'row',
    gap: 8,
  },
  metric: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  metricNum: {
    fontSize: 26,
    fontWeight: '900',
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
});
