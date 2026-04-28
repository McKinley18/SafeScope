import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { apiClient } from '../../src/api/client';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { useAppTheme } from '../../src/theme/ThemeContext';

export default function CommandCenter() {
  const { colors } = useAppTheme();
  const [siteId, setSiteId] = useState('all');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (siteId === 'all') {
      apiClient.getCorporateSummary().then(setData);
    } else {
      apiClient.getExecutiveSummary(siteId).then(setData);
    }
  }, [siteId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BrandedHeader title="Safety Command Center" />
      <Text style={styles.subtitle}>Real-time view of risk exposure, overdue actions, trends, and priorities across all operations.</Text>
      
      <View style={styles.kpiRow}>
        <KpiCard label="Critical Exposure" value={data?.criticalRiskFindings || 0} color="#991B1B" />
        <KpiCard label="High Risk" value={data?.highRiskFindings || 0} color="#F97316" />
        <KpiCard label="Overdue" value={data?.overdueActions || 0} color="#7E22CE" />
        <KpiCard label="Completion" value="88%" color="#16A34A" />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Immediate Attention Required</Text>
        <Text style={styles.body}>{data?.executiveSummaryText || 'No urgent hazards detected.'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Overdue Actions</Text>
        {data?.overdueItems?.map((o: any) => <Text key={o.id} style={styles.listItem}>{o.title}</Text>)}
      </View>
    </ScrollView>
  );
}

const KpiCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
    <View style={styles.kpi}><Text style={[styles.kpiValue, {color}]}>{value}</Text><Text style={styles.kpiLabel}>{label}</Text></View>
);

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F9FAFB' },
  subtitle: { fontSize: 14, color: '#4B5563', marginBottom: 20, textAlign: 'center' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  kpi: { backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', width: '23%', borderWidth: 1, borderColor: '#E5E7EB' },
  kpiValue: { fontSize: 18, fontWeight: '900' },
  kpiLabel: { fontSize: 9, fontWeight: '700', color: '#6B7280', marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 16, color: '#111827' },
  body: { fontSize: 14, color: '#374151', lineHeight: 22 },
  listItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F3F4F6', fontSize: 14 }
});
