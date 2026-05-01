import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { apiClient } from '../../src/api/client';
import BrandedHeader from '../../src/components/ui/BrandedHeader';

const emptyData = {
  totalSites: 0,
  totalFindings: 0,
  openActions: 0,
  overdueActions: 0,
  highRiskFindings: 0,
  criticalRiskFindings: 0,
  executiveSummaryText: 'No urgent hazards detected.',
  siteRankings: [],
  overdueItems: [],
};

export default function CommandCenter() {
  const [siteId, setSiteId] = useState<'all' | string>('all');
  const [data, setData] = useState<any>(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const request =
      siteId === 'all'
        ? apiClient.getCorporateSummary()
        : apiClient.getExecutiveSummary(siteId);

    request
      .then((res: any) => setData({ ...emptyData, ...res }))
      .catch(() => setData(emptyData))
      .finally(() => setLoading(false));
  }, [siteId]);

  const rankings = useMemo(() => data?.siteRankings || [], [data]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BrandedHeader
        title="Safety Command Center"
        subtitle="Monitor inspections, hazards, corrective actions, and safety intelligence."
      />

      <Text style={styles.subtitle}>
        Fast executive view of risk exposure, overdue work, and priority actions across operations.
      </Text>

      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchButton, siteId === 'all' && styles.switchButtonActive]}
          onPress={() => setSiteId('all')}
        >
          <Text style={[styles.switchText, siteId === 'all' && styles.switchTextActive]}>All Sites</Text>
        </TouchableOpacity>

        {rankings.slice(0, 3).map((site: any) => (
          <TouchableOpacity
            key={site.siteId || site.siteName}
            style={[styles.switchButton, siteId === site.siteId && styles.switchButtonActive]}
            onPress={() => site.siteId && setSiteId(site.siteId)}
          >
            <Text style={[styles.switchText, siteId === site.siteId && styles.switchTextActive]}>
              {site.siteName || 'Site'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.kpiGrid}>
        <KpiCard label="Critical Exposure" value={data.criticalRiskFindings || 0} tone="critical" />
        <KpiCard label="High Risk" value={data.highRiskFindings || 0} tone="warning" />
        <KpiCard label="Open Actions" value={data.openActions || 0} tone="neutral" />
        <KpiCard label="Overdue" value={data.overdueActions || 0} tone="purple" />
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Today’s Focus</Text>
        <Text style={styles.title}>Immediate Attention Required</Text>
        <Text style={styles.body}>
          {loading ? 'Loading operational status…' : data.executiveSummaryText}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Corporate Rollup</Text>
        <Text style={styles.title}>Site Risk Rankings</Text>

        {rankings.length === 0 ? (
          <Text style={styles.empty}>No site data available yet.</Text>
        ) : (
          rankings.map((site: any, index: number) => (
            <View key={`${site.siteName}-${index}`} style={styles.rankingRow}>
              <View>
                <Text style={styles.rankingTitle}>{site.siteName}</Text>
                <Text style={styles.rankingMeta}>
                  {site.openActions || 0} open · {site.overdueCount || 0} overdue
                </Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scoreText}>{site.riskScore || 0}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Action Control</Text>
        <Text style={styles.title}>Overdue Actions</Text>

        {(data.overdueItems || []).length === 0 ? (
          <Text style={styles.empty}>No overdue actions found.</Text>
        ) : (
          data.overdueItems.map((item: any) => (
            <Text key={item.id || item.title} style={styles.listItem}>
              {item.title || 'Corrective action'}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const KpiCard = ({ label, value, tone }: { label: string; value: string | number; tone: keyof typeof toneColors }) => (
  <View style={styles.kpi}>
    <Text style={[styles.kpiValue, { color: toneColors[tone] }]}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
  </View>
);

const toneColors = {
  critical: '#991B1B',
  warning: '#EA580C',
  neutral: '#1D4ED8',
  purple: '#7E22CE',
};

const styles = StyleSheet.create({
  container: { padding: tokens.spacing.md, backgroundColor: '#F6F8FB', paddingBottom: 110 },
  subtitle: { fontSize: 14, color: '#475467', marginBottom: 18, textAlign: 'center', lineHeight: 21 },
  switchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  switchButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D0D5DD', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  switchButtonActive: { backgroundColor: '#0B3B75', borderColor: '#0B3B75' },
  switchText: { color: '#344054', fontWeight: '800', fontSize: 12 },
  switchTextActive: { color: '#FFFFFF' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  kpi: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, alignItems: 'center', flexBasis: '47%', flexGrow: 1, borderWidth: 1, borderColor: '#E5E7EB' },
  kpiValue: { fontSize: 24, fontWeight: '900' },
  kpiLabel: { fontSize: 11, fontWeight: '800', color: '#667085', marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  eyebrow: { fontSize: 11, fontWeight: '900', color: '#0B3B75', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '900', marginBottom: 10, color: '#101828' },
  body: { fontSize: 14, color: '#344054', lineHeight: 22 },
  empty: { fontSize: 14, color: '#667085', lineHeight: 22 },
  rankingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F2F4F7' },
  rankingTitle: { fontSize: 14, fontWeight: '900', color: '#101828' },
  rankingMeta: { fontSize: 12, color: '#667085', marginTop: 3 },
  scorePill: { backgroundColor: '#FEF3C7', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  scoreText: { fontSize: 13, fontWeight: '900', color: '#92400E' },
  listItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F2F4F7', fontSize: 14, color: '#344054' },
});
