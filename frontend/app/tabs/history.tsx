import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HistoryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Audit History</Text>
      <Text style={styles.subtitle}>
        Past audits, summaries, and trend history will appear here.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>North Plant Weekly Audit</Text>
        <Text style={styles.cardMeta}>Published • 2 high-risk findings • 12 total findings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Processing Area B Walkthrough</Text>
        <Text style={styles.cardMeta}>In Review • 1 high-risk finding • 6 total findings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>South Mezzanine Safety Check</Text>
        <Text style={styles.cardMeta}>Closed • 0 high-risk findings • 3 total findings</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#050505',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#232323',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMeta: {
    color: '#9ca3af',
    fontSize: 13,
  },
});
