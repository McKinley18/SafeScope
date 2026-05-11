import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";

const teamMembers = [
  { name: "Christopher McKinley", role: "Owner", status: "Active" },
  { name: "Safety Auditor", role: "Auditor", status: "Pending" },
];

export default function SettingsScreen() {
  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Account & Governance</Text>
        <Text style={styles.pageSubtitle}>
          Manage your workspace, team access, organization identity, and profile settings.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Plan & Utilization</Text>

        <View style={styles.statRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>Current Plan</Text>
            <Text style={styles.statValue}>Enterprise Departmental</Text>
          </View>

          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>Seat Usage</Text>
            <Text style={styles.statValue}>2 / 10</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Team Hub</Text>
        <Text style={styles.sectionDesc}>
          Invite team members and assign workspace roles.
        </Text>

        <Text style={styles.label}>Invite Email</Text>
        <TextInput
          style={styles.input}
          placeholder="team.member@company.com"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleRow}>
          <View style={styles.roleBadgeActive}>
            <Text style={styles.roleBadgeActiveText}>Auditor</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Viewer</Text>
          </View>
        </View>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Send Invite</Text>
        </Pressable>

        <View style={styles.memberList}>
          {teamMembers.map((member) => (
            <View key={member.name} style={styles.memberRow}>
              <View style={styles.statusDot} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberMeta}>
                  {member.role} · {member.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Organization Identity</Text>

        <Text style={styles.label}>Organization Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Company or department name"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Primary Regulatory Standard</Text>
        <View style={styles.roleRow}>
          <View style={styles.roleBadgeActive}>
            <Text style={styles.roleBadgeActiveText}>MSHA</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>OSHA</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Save All Settings</Text>
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
  pageTitle: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "900",
  },
  pageSubtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  sectionDesc: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  statRow: {
    gap: 12,
  },
  statBadge: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  statValue: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    color: "#0F172A",
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  roleBadgeActive: {
    backgroundColor: "#0369A1",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  roleBadgeActiveText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
  roleBadge: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  roleBadgeText: {
    color: "#334155",
    fontWeight: "900",
    fontSize: 13,
  },
  secondaryButton: {
    width: 170,
    alignSelf: "center",
    backgroundColor: "#0F172A",
    borderRadius: 999,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  memberList: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 12,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#059669",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
  },
  memberMeta: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },
  securityButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  securityButtonText: {
    color: "#0F172A",
    fontWeight: "900",
  },
  primaryButton: {
    width: 170,
    alignSelf: "center",
    backgroundColor: "#0F172A",
    borderRadius: 999,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
});
