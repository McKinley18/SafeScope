import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";
import { Link } from "expo-router";

const sections = [
  {
    title: "Intelligent Standard Matching",
    body: "SafeScope Intelligence is the proprietary engine within Sentinel Safety that helps map observed hazards to relevant MSHA, OSHA, and safety management concepts.",
  },
  {
    title: "Learning and Feedback",
    body: "User review, acceptance, rejection, and correction feedback can improve the taxonomy and strengthen future standards-matching logic.",
  },
  {
    title: "Security and Isolation",
    body: "SafeScope is designed as a protected intelligence layer. Organizational data should remain isolated by workspace and handled as sensitive operational information.",
  },
  {
    title: "Professional Oversight",
    body: "SafeScope does not replace competent safety professionals. All AI suggestions must be reviewed, verified, and approved before use in official reports or operational decisions.",
  },
];

export default function SafeScopeScreen() {
  return (
    <LayoutContainer showNav={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Sentinel Safety Intelligence</Text>
        <Text style={styles.title}>SafeScope</Text>
        <Text style={styles.lead}>
          SafeScope is the proprietary intelligence engine powering hazard classification, standards suggestions, and report-support logic inside Sentinel Safety.
        </Text>
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}

      <Link href="/login" asChild>
        <Text style={styles.signInLink}>
          Return to Sign In
        </Text>
      </Link>

    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0F172A",
    borderRadius: 26,
    padding: 24,
    marginBottom: 22,
  },
  eyebrow: {
    color: "#F97316",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 10,
  },
  lead: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
  section: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 6,

  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  body: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
  },

  signInLink: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 6,

  },
});
