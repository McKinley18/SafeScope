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
    ['Review', 'shield-checkmark-outline', '/tabs/review'],
    ['Reports', 'document-text-outline', '/tabs/history'],
    ['Settings', 'settings-outline', '/tabs/settings'],
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.hero, { backgroundColor: '#0b1120' }]}>
        <Image
          source={require('../../assets/images/logo-header.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: '#FFFFFF' }]}>Command Center</Text>
        <Text style={[styles.subtitle, { color: colors.sub }]}>
          Safety intelligence for inspections, reporting, and corrective action management.
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
      <View style={{ height: 12 }} />

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
    alignItems: 'center',
    marginHorizontal: -16,
    marginTop: -16,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  logo: {
    width: '100%',
    height: 170,
    maxWidth: 760,
    alignSelf: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: -4,
    letterSpacing: -0.6,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 350,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 14,
  },
  list: {
    marginBottom: 12,
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
