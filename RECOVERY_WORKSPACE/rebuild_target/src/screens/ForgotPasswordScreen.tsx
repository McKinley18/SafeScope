import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";

export default function ForgotPasswordScreen() {
  return (
    <LayoutContainer showNav={false}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          Enter the email connected to your Sentinel Safety workspace. We’ll send password reset instructions.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </Pressable>

        <Text style={styles.switchText}>Return to sign in</Text>
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  title: {
    color: "#081827",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  input: {
    width: "88%",
    alignSelf: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    height: 52,
    marginBottom: 14,
    color: "#081827",
  },
  button: {
    width: 240,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F97316",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  switchText: {
    color: "#0369A1",
    textAlign: "center",
    fontWeight: "800",
    marginTop: 18,
  },
});
