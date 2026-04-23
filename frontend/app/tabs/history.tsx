import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../../src/theme/ThemeContext';

export default function HistoryScreen() {
  const { colors } = useAppTheme();

  const bg = colors.bg;
  const card = colors.card;
  const border = colors.border;
  const text = colors.text;
  const sub = colors.sub;
  const muted = colors.muted;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.title, { color: text }]}>Audit History</Text>
      <Text style={[styles.subtitle, { color: sub }]}>
        Past audits, summaries, and trend history will appear here.
      </Text>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <Text style={[styles.cardTitle, { color: text }]}>North Plant Weekly Audit</Text>
        <Text style={[styles.cardMeta, { color: muted }]}>
          Published • 2 high-risk findings • 12 total findings
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <Text style={[styles.cardTitle, { color: text }]}>Processing Area B Walkthrough</Text>
        <Text style={[styles.cardMeta, { color: muted }]}>
          In Review • 1 high-risk finding • 6 total findings
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <Text style={[styles.cardTitle, { color: text }]}>South Mezzanine Safety Check</Text>
        <Text style={[styles.cardMeta, { color: muted }]}>
          Closed • 0 high-risk findings • 3 total findings
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 13,
  },
});
