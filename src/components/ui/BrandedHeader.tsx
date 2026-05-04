import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const logo = require("../../../assets/images/logo-header.jpg");

export default function BrandedHeader({ title }: { title?: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.brandHeader}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>
          {title || "Sentinel Safety"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0A1F33",
  },
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    color: "#E5E7EB",
    fontSize: 18,
    fontWeight: "600",
  },
});

