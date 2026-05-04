import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// 🔥 Adjust path if needed (we’ll verify next)
import logoHeader from "../../assets/images/logo-final-navy-clean.png";

export default function AuthGate({ children }: any) {
  // Temporary pass-through (no auth logic yet)
  return (
    <View style={styles.container}>
      <Image source={logoHeader} style={styles.logo} />

      <Text style={styles.title}>Welcome to Sentinel Safety</Text>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    color: "#e5e7eb",
    fontSize: 20,
    fontWeight: "600",
  },
});
