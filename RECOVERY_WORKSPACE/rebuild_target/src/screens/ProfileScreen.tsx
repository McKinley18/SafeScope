import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";

export default function ProfileScreen() {
  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Profile Settings</Text>
        <Text style={styles.pageSubtitle}>
          Manage your personal profile and security credentials.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Profile</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} placeholder="Christopher" placeholderTextColor="#94A3B8" />

        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} placeholder="McKinley" placeholderTextColor="#94A3B8" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="mckinley.christopherd@gmail.com" placeholderTextColor="#94A3B8" />

        <Pressable style={styles.securityButton}>
          <Text style={styles.securityButtonText}>Update Security Credentials</Text>
        </Pressable>
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Save Profile</Text>
      </Pressable>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    borderLeftWidth: 5,
    borderLeftColor: "#0369A1",
    paddingLeft: 16,
    marginBottom: 22,
  },
  pageTitle: { color: "#0F172A", fontSize: 30, fontWeight: "900" },
  pageSubtitle: { color: "#64748B", fontSize: 14, lineHeight: 21, marginTop: 6 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  sectionTitle: { color: "#0F172A", fontSize: 20, fontWeight: "900", marginBottom: 8 },
  label: { color: "#334155", fontSize: 14, fontWeight: "800", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    color: "#0F172A",
  },
  securityButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  securityButtonText: { color: "#0F172A", fontWeight: "900" },
  primaryButton: {
    backgroundColor: "#0F172A",
    borderRadius: 999,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
});
