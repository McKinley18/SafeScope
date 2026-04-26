import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const metrics = [
    ['Open Actions', '0', 'construct-outline'],
    ['Pending Reviews', '0', 'shield-checkmark-outline'],
    ['Critical Risk', '0', 'warning-outline'],
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.brandHeader}>
        <Image
          source={require('../../assets/images/logo-header.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Command Center</Text>
        <Text style={[styles.pageSub, { color: colors.sub }]}>
          Operational safety overview, priority work, and field execution status.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Command Center</Text>

      <View style={styles.metrics}>
        {metrics.map(([label, value, icon]) => (
          <View key={label} style={[styles.metric, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name={icon as any} size={20} color={colors.accent} />
            <Text style={[styles.metricNum, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.metricLabel, { color: colors.sub }]}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.primaryAction}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.primaryTitle, { color: colors.text }]}>Start a Field Inspection</Text>
          <Text style={[styles.primarySub, { color: colors.sub }]}>
            Capture evidence, document findings, and build a report in the field.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/tabs/camera' as any)}
        >
          <Ionicons name="add-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority Items</Text>

      <View style={styles.feed}>
        {[
          ['No critical findings currently flagged', 'warning-outline'],
          ['No overdue corrective actions', 'checkmark-circle-outline'],
          ['No reports waiting longer than 24 hours', 'time-outline'],
        ].map(([label, icon]) => (
          <View key={label} style={[styles.feedRow, { borderBottomColor: colors.border }]}>
            <Ionicons name={icon as any} size={20} color={colors.accent} />
            <Text style={[styles.feedText, { color: colors.text }]}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Activity</Text>

      <View style={[styles.emptyPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No activity yet</Text>
        <Text style={[styles.emptyText, { color: colors.sub }]}>
          Submitted inspections, review decisions, and corrective action updates will appear here.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 20,
    flexGrow: 1,
  },
  brandHeader: {
    backgroundColor: '#05070d',
    marginHorizontal: -tokens.spacing.md,
    marginTop: -tokens.spacing.md,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  logo: {
    width: '165%',
    height: 305,
    maxWidth: 1600,
    alignSelf: 'center',
    marginTop: -42,
    marginBottom: -24,
  },
  titleBlock: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  pageSub: {
    marginTop: 7,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    maxWidth: 390,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
  },
  metrics: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
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
  primaryAction: {
    paddingVertical: 6,
    marginBottom: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  primaryTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  primarySub: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  primaryButton: {
    minWidth: 76,
    height: 46,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  feed: {
    marginBottom: 24,
  },
  feedRow: {
    minHeight: 54,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  feedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  emptyPanel: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
});
