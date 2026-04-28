import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { apiClient } from '../../src/api/client';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';

export default function CommandCenter() {
  const { colors } = useAppTheme();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient.getExecutiveSummary().then(setData);
  }, []);

  if (!data) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BrandedHeader title="Executive Command Center" />
      
      <View style={styles.kpiRow}>
        <KpiCard label="Critical" value={data.criticalRiskFindings} color="#DC2626" />
        <KpiCard label="High" value={data.highRiskFindings} color="#F97316" />
        <KpiCard label="Open" value={data.openActions} color="#2563EB" />
        <KpiCard label="Overdue" value={data.overdueActions} color="#9333EA" />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Executive Summary</Text>
        <Text style={styles.body}>{data.executiveSummaryText}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Top Risks</Text>
        {data.topRisks.map((r: any) => <Text key={r.id} style={styles.listItem}>{r.title}</Text>)}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Overdue Actions</Text>
        {data.overdueItems.map((o: any) => <Text key={o.id} style={styles.listItem}>{o.title}</Text>)}
      </View>
    </ScrollView>
  );
}

const KpiCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <View style={styles.kpi}><Text style={[styles.kpiValue, {color}]}>{value}</Text><Text style={styles.kpiLabel}>{label}</Text></View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  kpi: { backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center', width: '23%' },
  kpiValue: { fontSize: 20, fontWeight: '900' },
  kpiLabel: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  title: { fontSize: 16, fontWeight: '900', marginBottom: 12 },
  body: { fontSize: 14, color: '#475467', lineHeight: 20 },
  listItem: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F3F4F6' }
});
