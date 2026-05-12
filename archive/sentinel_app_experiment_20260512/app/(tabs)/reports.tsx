import { View, StyleSheet } from 'react-native';
import { AppText } from '../../src/components/AppText';

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Completed Reports</AppText>
      <View style={styles.grid}>
        <View style={styles.card}><AppText style={styles.label}>Total Reports</AppText><AppText style={styles.value}>0</AppText></View>
        <View style={styles.card}><AppText style={styles.label}>Open Findings</AppText><AppText style={styles.value}>0</AppText></View>
        <View style={styles.card}><AppText style={styles.label}>High Risk</AppText><AppText style={styles.value}>0</AppText></View>
        <View style={styles.card}><AppText style={styles.label}>Overdue</AppText><AppText style={styles.value}>0</AppText></View>
      </View>
      <AppText style={styles.emptyText}>No completed reports found.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', padding: 15, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 12, color: '#64748B' },
  value: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  emptyText: { marginTop: 30, color: '#64748B', textAlign: 'center' }
});
