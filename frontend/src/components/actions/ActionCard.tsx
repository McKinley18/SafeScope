import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CorrectiveAction } from "../../types/actions";

export default function ActionCard({
  item,
}: {
  item: CorrectiveAction;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Assigned: {item.assignedTo}</Text>
      <Text>Due: {item.dueDate}</Text>
      <Text>Priority: {item.priority}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6
  }
});
