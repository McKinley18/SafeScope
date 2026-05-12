import { View, Text } from "react-native";

export default function Dashboard() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0A1F33"
      }}
    >
      <Text style={{ fontSize: 28, color: "white" }}>
        Sentinel Safety Dashboard
      </Text>
    </View>
  );
}
