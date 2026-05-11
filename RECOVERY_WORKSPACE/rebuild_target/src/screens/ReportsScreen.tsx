import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LayoutContainer from "../components/LayoutContainer";

const reportMetrics = [
  { label: "Total Reports", value: "0" },
  { label: "Open Findings", value: "0" },
  { label: "High Risk Findings", value: "0" },
  { label: "Overdue Actions", value: "0" },
];

export default function ReportsScreen() {
  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Reports</Text>
        <Text style={styles.pageSubtitle}>
          Search completed reports, review inspection outcomes, and monitor report-based safety trends.
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        {reportMetrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.completedHeader}>
          <View>
            <Text style={styles.sectionTitle}>Completed Reports</Text>
            <Text style={styles.sectionSubtitle}>
              Search and review finalized inspection reports.
            </Text>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>No completed reports yet</Text>
          <Text style={styles.emptyText}>
            Completed inspection reports will appear here after inspections are generated.
          </Text>
        </View>
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    borderLeftWidth: 4,
    borderLeftColor: "#1D72B8",
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
  metricsGrid: {
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "900",
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
  },
  completedHeader: {
    gap: 14,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
    width: "100%",
  },
  emptyState: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
});
