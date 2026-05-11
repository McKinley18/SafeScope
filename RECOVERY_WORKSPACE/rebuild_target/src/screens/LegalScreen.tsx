import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";
import { Link } from "expo-router";

const sections = [
  {
    title: "General Disclaimer",
    body: "Sentinel Safety is a decision-support platform. It does not replace professional judgment, site-specific safety evaluation, legal advice, regulatory interpretation, or qualified safety oversight.",
  },
  {
    title: "Statistical and Analytical Data",
    body: "Analytics, SPC concepts, RPN scoring, dashboards, and predictive indicators are advisory tools only. Users are responsible for validating all conclusions before making operational decisions.",
  },
  {
    title: "SafeScope AI Content",
    body: "SafeScope-generated classifications, standards suggestions, summaries, and corrective action recommendations must be reviewed and verified by a qualified human professional.",
  },
  {
    title: "Liability and Indemnification",
    body: "Users accept responsibility for how the platform is used and agree that Sentinel Safety and its developers are not liable for damages, citations, injuries, losses, or decisions arising from misuse or unverified outputs.",
  },
  {
    title: "User Responsibility",
    body: "The quality of any output depends on the accuracy, completeness, and context of user-provided information, photos, descriptions, and site details.",
  },
];

export default function LegalScreen() {
  return (
    <LayoutContainer showNav={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Legal Disclaimer</Text>
        <Text style={styles.warning}>
          Use of Sentinel Safety is at your own risk. All outputs require professional human verification.
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
    borderLeftWidth: 5,
    borderLeftColor: "#991B1B",
    paddingLeft: 16,
    marginBottom: 24,
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 10,
  },
  warning: {
    color: "#991B1B",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "900",
  },
  section: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 6,

  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 19,
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
