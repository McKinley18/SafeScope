import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";

const stats = [
  { label: "Pending Reviews", value: "8", color: "#0369A1" },
  { label: "Overdue Actions", value: "4", color: "#DC2626" },
  { label: "Inspections Due", value: "6", color: "#D97706" },
  { label: "Site Alerts", value: "3", color: "#7C3AED" },
];

const activities = [
  {
    user: "Safety Lead",
    action: "reviewed inspection findings",
    site: "Plant East",
    time: "12 minutes ago",
  },
  {
    user: "Operations",
    action: "updated corrective action status",
    site: "Warehouse North",
    time: "38 minutes ago",
  },
  {
    user: "System",
    action: "flagged overdue inspection",
    site: "Main Processing Area",
    time: "1 hour ago",
  },
];

export default function CommandCenterScreen() {
  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Command Center</Text>
        <Text style={styles.pageSubtitle}>
          Monitor operational safety status, priority work, and recent platform activity.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Operational Status</Text>

      <View style={styles.statGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>High-Priority Actions</Text>
        <Text style={styles.emptyText}>
          No high-priority actions require immediate attention.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>

        {activities.map((item, index) => (
          <View key={index} style={styles.activityRow}>
            <View style={styles.activityDot} />

            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={styles.activityUser}>{item.user}</Text>{" "}
                {item.action} at{" "}
                <Text style={styles.activitySite}>{item.site}</Text>
              </Text>

              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    borderLeftWidth: 4,
    borderLeftColor: "#0369A1",
    paddingLeft: 16,
    marginBottom: 22,
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
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  statValue: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 21,
  },
  activityRow: {
    flexDirection: "row",
    paddingVertical: 11,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0369A1",
    marginTop: 6,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityText: {
    color: "#1E293B",
    fontSize: 14,
    lineHeight: 20,
  },
  activityUser: {
    fontWeight: "900",
    color: "#0F172A",
  },
  activitySite: {
    fontWeight: "800",
    color: "#0369A1",
  },
  activityTime: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 3,
  },
});
