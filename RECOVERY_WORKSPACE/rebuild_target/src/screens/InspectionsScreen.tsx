import React from "react";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";

export default function InspectionsScreen() {
  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Inspections</Text>
        <Text style={styles.pageSubtitle}>
          Start new safety inspections, continue active walkthroughs, and prepare findings for report generation.
        </Text>
      </View>

      <View style={styles.quickStartCard}>
        <Text style={styles.quickLabel}>Inspection Workflow</Text>
        <Text style={styles.quickTitle}>Begin a New Safety Inspection</Text>
        <Text style={styles.quickText}>
          Launch the guided inspection builder to document findings, add evidence, classify hazards with SafeScope, and prepare corrective actions.
        </Text>

        <Link href="/inspection-cover" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Begin Inspection</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Active Inspections</Text>
        <Text style={styles.emptyText}>
          Active inspection drafts will appear here after session persistence is connected.
        </Text>
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
  quickStartCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },
  quickLabel: {
    color: "#F97316",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  quickTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },
  quickText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#1D72B8",
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
  },
});
