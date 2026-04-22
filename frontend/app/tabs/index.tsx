import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LegalDisclaimer from '../../components/LegalDisclaimer';

const kpis = [
  { label: 'Company Risk Score', value: '82', trend: '+4%', icon: 'shield-checkmark-outline' as const },
  { label: 'Open Actions', value: '14', trend: '-2', icon: 'construct-outline' as const },
  { label: 'Audits This Month', value: '27', trend: '+6', icon: 'document-text-outline' as const },
  { label: 'High-Risk Findings', value: '5', trend: '-1', icon: 'warning-outline' as const },
];

const activity = [
  { title: 'North Plant audit published', meta: '12 minutes ago' },
  { title: '3 corrective actions overdue', meta: 'Processing Area B' },
  { title: 'Fall protection finding escalated', meta: 'South Mezzanine' },
];

export default function Home() {
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const bg = dark ? '#050505' : '#f8fafc';
  const card = dark ? '#111111' : '#ffffff';
  const cardAlt = dark ? '#171717' : '#f1f5f9';
  const border = dark ? '#232323' : '#e5e7eb';
  const text = dark ? '#ffffff' : '#111827';
  const sub = dark ? '#cbd5e1' : '#475569';
  const muted = dark ? '#9ca3af' : '#64748b';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: bg }}>
      <View style={[styles.container, { backgroundColor: bg }]}>
        <LegalDisclaimer onAccept={() => {}} />

        <View style={[styles.heroCard, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.heroTitle, { color: text }]}>Safety Intelligence Command</Text>
          <Text style={[styles.subtitle, { color: sub }]}>
            Monitor risk, manage actions, and accelerate audits across your operation.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={() => router.push('/tabs/camera')}
            >
              <Ionicons name="camera-outline" size={18} color="#fff" />
              <Text style={styles.primaryText}>Start New Audit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryAction, { backgroundColor: cardAlt, borderColor: border }]}
              onPress={() => router.push('/tabs/history' as any)}
            >
              <Ionicons name="time-outline" size={18} color={text} />
              <Text style={[styles.secondaryText, { color: text }]}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: text }]}>Operational Snapshot</Text>
          <TouchableOpacity onPress={() => router.push('/tabs/analytics' as any)}>
            <Text style={styles.sectionLink}>Open Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.kpiGrid}>
          {kpis.map((item) => (
            <View
              key={item.label}
              style={[styles.kpiCard, { backgroundColor: card, borderColor: border }]}
            >
              <View style={styles.kpiTop}>
                <View style={styles.kpiIconWrap}>
                  <Ionicons name={item.icon} size={18} color="#ff6a00" />
                </View>
                <Text style={styles.kpiTrend}>{item.trend}</Text>
              </View>
              <Text style={[styles.kpiValue, { color: text }]}>{item.value}</Text>
              <Text style={[styles.kpiLabel, { color: muted }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: text }]}>Quick Actions</Text>
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push('/tabs/review')}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color="#ff6a00" />
            <Text style={[styles.quickTitle, { color: text }]}>Review Queue</Text>
            <Text style={[styles.quickSub, { color: muted }]}>Validate AI findings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push('/tabs/analytics' as any)}
          >
            <Ionicons name="bar-chart-outline" size={20} color="#ff6a00" />
            <Text style={[styles.quickTitle, { color: text }]}>Analytics</Text>
            <Text style={[styles.quickSub, { color: muted }]}>View trends and KPIs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push('/tabs/settings')}
          >
            <Ionicons name="options-outline" size={20} color="#ff6a00" />
            <Text style={[styles.quickTitle, { color: text }]}>Settings</Text>
            <Text style={[styles.quickSub, { color: muted }]}>Profile and defaults</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push('/tabs/history' as any)}
          >
            <Ionicons name="documents-outline" size={20} color="#ff6a00" />
            <Text style={[styles.quickTitle, { color: text }]}>Audit History</Text>
            <Text style={[styles.quickSub, { color: muted }]}>Past audits and stats</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: text }]}>Recent Activity</Text>
        </View>

        <View style={[styles.activityCard, { backgroundColor: card, borderColor: border }]}>
          {activity.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.activityRow,
                index < activity.length - 1 && { borderBottomWidth: 1, borderBottomColor: border },
              ]}
            >
              <View style={styles.activityDot} />
              <View style={styles.activityTextWrap}>
                <Text style={[styles.activityTitle, { color: text }]}>{item.title}</Text>
                <Text style={[styles.activityMeta, { color: muted }]}>{item.meta}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 22,
    paddingBottom: 28,
    flex: 1,
  },
  heroCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoWrap: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 10,
  },
  logo: {
    width: 340,
    height: 136,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
    marginBottom: 16,
  },
  heroButtons: {
    width: '100%',
    gap: 10,
  },
  primaryAction: {
    backgroundColor: '#ff6a00',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryAction: {
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#ff6a00',
    fontSize: 13,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kpiCard: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,106,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTrend: {
    color: '#ff6a00',
    fontSize: 12,
    fontWeight: '800',
  },
  kpiValue: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  quickGrid: {
    marginBottom: 18,
  },
  quickCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  quickSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  activityCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff6a00',
    marginTop: 5,
    marginRight: 12,
  },
  activityTextWrap: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  activityMeta: {
    fontSize: 13,
  },
});
