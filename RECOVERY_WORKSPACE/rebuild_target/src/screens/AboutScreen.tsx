import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";
import { Link } from "expo-router";

export default function AboutScreen() {
  return (
    <LayoutContainer showNav={false}>
      <View style={styles.header}>
        <Text style={styles.title}>About Sentinel Safety</Text>
        <Text style={styles.lead}>
          Sentinel Safety is an intelligent safety platform built from real-world operational experience, safety leadership, and business strategy.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Mission</Text>
        <Text style={styles.body}>
          Our mission is to help serious operations identify hazards earlier, create stronger inspection records, and convert findings into accountable corrective action.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Result</Text>
        <Text style={styles.body}>
          Sentinel Safety gives teams a structured way to document risk, support professional judgment, and build defensible safety intelligence over time.
        </Text>
      </View>

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
    borderLeftColor: "#0369A1",
    paddingLeft: 16,
    marginBottom: 24,
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 10,
  },
  lead: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
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
