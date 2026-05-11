import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";
import {
  benchmarkData,
  complianceRadarData,
  metrics,
  morningBrief,
  proGatingContent,
  riskData,
  spcData,
} from "../reference/analyticsReference";

export default function AnalyticsScreen() {
  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Safety Intelligence Dashboard</Text>
        <Text style={styles.pageSubtitle}>
          Scientific decision-support environment validating organizational resilience.
        </Text>
      </View>

      <View style={styles.briefCard}>
        <Text style={styles.briefEyebrow}>Morning Intelligence Brief</Text>

        {morningBrief.map((item) => (
          <View key={item.rank} style={styles.briefItem}>
            <Text style={styles.briefRank}>{item.rank}</Text>

            <View style={styles.briefBody}>
              <Text style={styles.briefLabel}>{item.label}</Text>
              <Text style={styles.briefDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {metrics.map((chapter) => (
        <View key={chapter.category} style={styles.chapter}>
          <Text style={styles.chapterEyebrow}>{chapter.category}</Text>
          <Text style={styles.chapterTitle}>{chapter.lead}</Text>
          <Text style={styles.chapterDesc}>{chapter.desc}</Text>

          {chapter.items.map((item) => (
            <View key={item.label} style={styles.metricCard}>
              <View style={styles.metricTopRow}>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={[styles.metricTrend, { color: item.trendColor }]}>
                  {item.trend}
                </Text>
              </View>

              <Text style={styles.metricValue}>{item.value}</Text>

              <View style={styles.formulaBox}>
                <Text style={styles.formulaLabel}>Formula</Text>
                <Text style={styles.formulaText}>{item.equation}</Text>
              </View>

              <Text style={styles.insightLabel}>Why it matters</Text>
              <Text style={styles.insightText}>{item.justification}</Text>

              <Text style={styles.insightLabel}>Strategic impact</Text>
              <Text style={styles.insightText}>{item.impact}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.chapter}>
        <Text style={styles.chapterEyebrow}>Deep Analytical Intelligence</Text>
        <Text style={styles.chapterTitle}>Multi-Dimensional Risk Mapping</Text>
        <Text style={styles.chapterDesc}>
          Native chart rendering will be added after the core screens are stable. These placeholders preserve the legacy analytics structure.
        </Text>

        <View style={styles.chartGrid}>
          <ChartPlaceholder
            title="Regulatory Hot Zones"
            subtitle="Normalized compliance density"
            rows={complianceRadarData.map((item) => `${item.subject}: ${item.A}`)}
          />

          <ChartPlaceholder
            title="Process Stability (SPC)"
            subtitle="Statistical variance detection"
            rows={spcData.map((item) => `${item.month}: ${item.findings} findings`)}
          />

          <ChartPlaceholder
            title="Risk Priority Matrix (RPN)"
            subtitle="Likelihood x Severity"
            rows={riskData.map(
              (item) => `${item.name}: L${item.likelihood} x S${item.severity}`
            )}
          />

          <ChartPlaceholder
            title="Maturity Benchmarking"
            subtitle="Site-specific performance ranking"
            rows={benchmarkData.map((item) => `${item.site}: ${item.score}`)}
          />
        </View>
      </View>

      <View style={styles.proCard}>
        <Text style={styles.proTitle}>{proGatingContent.title}</Text>
        <Text style={styles.proText}>{proGatingContent.description}</Text>
        <View style={styles.proButton}>
          <Text style={styles.proButtonText}>{proGatingContent.cta}</Text>
        </View>
      </View>
    </LayoutContainer>
  );
}

function ChartPlaceholder({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: string[];
}) {
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Text style={styles.chartSubtitle}>{subtitle}</Text>

      <View style={styles.chartPlaceholder}>
        {rows.map((row) => (
          <Text key={row} style={styles.chartRow}>
            {row}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
    paddingLeft: 16,
    marginBottom: 18,
  },
  pageTitle: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "900",
  },
  pageSubtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  briefCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
  },
  briefEyebrow: {
    color: "#F97316",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 18,
  },
  briefItem: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  briefRank: {
    color: "rgba(255,255,255,0.22)",
    fontSize: 27,
    fontWeight: "900",
    width: 42,
  },
  briefBody: {
    flex: 1,
  },
  briefLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  briefDesc: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
  },
  chapter: {
    marginBottom: 30,
  },
  chapterEyebrow: {
    color: "#F97316",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  chapterTitle: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  chapterDesc: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderLeftWidth: 4,
    borderLeftColor: "#0F172A",
  },
  metricTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    flex: 1,
  },
  metricTrend: {
    fontSize: 11,
    fontWeight: "900",
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 14,
  },
  formulaBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 12,
  },
  formulaLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  formulaText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "800",
  },
  insightLabel: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 3,
  },
  insightText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
  },
  chartGrid: {
    gap: 14,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chartTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
  },
  chartSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  chartPlaceholder: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  chartRow: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  proCard: {
    backgroundColor: "#0F172A",
    borderRadius: 22,
    padding: 22,
    marginBottom: 10,
  },
  proTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  proText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  proButton: {
    backgroundColor: "#F97316",
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  proButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
