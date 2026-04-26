import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { actions } from "../../src/data/actions";
import ActionCard from "../../src/components/actions/ActionCard";

export default function ActionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Action Tracker</Text>

      <FlatList
        data={actions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActionCard item={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f6f8"
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16
  }
});
