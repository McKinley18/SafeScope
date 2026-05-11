import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";
import { Link } from "expo-router";

export default function LoginScreen() {
  return (
    <LayoutContainer showNav={false}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Sentinel Safety</Text>
        <Text style={styles.subtitle}>
          Sign in to your safety intelligence workspace.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94A3B8"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
        />

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>

        <Link href="/dashboard" asChild>
          <Pressable style={styles.bypassButton}>
            <Text style={styles.bypassButtonText}>Continue to App</Text>
          </Pressable>
        </Link>

        <Text style={styles.link}>Forgot password?</Text>
        <Text style={styles.switchText}>Need a workspace? Create an account</Text>
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  title: {
    color: "#081827",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: 240,
    alignSelf: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    height: 52,
    marginBottom: 10,
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
  bypassButton: {
    width: 240,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0F172A",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  bypassButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  link: {
    color: "#0369A1",
    textAlign: "center",
    fontWeight: "800",
    marginTop: 18,
  },
  switchText: {
    color: "#64748B",
    textAlign: "center",
    fontWeight: "700",
    marginTop: 14,
  },
});
