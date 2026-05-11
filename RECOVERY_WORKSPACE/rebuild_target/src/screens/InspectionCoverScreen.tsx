import React, { useState } from "react";
import { Link } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LayoutContainer from "../components/LayoutContainer";

export default function InspectionCoverScreen() {
  const [isConfidential, setIsConfidential] = useState(false);
  const [additionalInspectors, setAdditionalInspectors] = useState([""]);

  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Inspection Cover Page</Text>
        <Text style={styles.pageSubtitle}>
          Enter the administrative information that will appear on the final inspection report cover page.
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Administrative Information</Text>

        <Text style={styles.label}>Organization Name</Text>
        <TextInput style={styles.input} placeholder="Company / organization" placeholderTextColor="#94A3B8" />

        <Text style={styles.label}>Site Location</Text>
        <TextInput style={styles.input} placeholder="Warehouse North, Plant East, etc." placeholderTextColor="#94A3B8" />

        <Text style={styles.label}>Inspection Date</Text>
        <TextInput style={styles.input} placeholder="MM/DD/YYYY" placeholderTextColor="#94A3B8" />

        <Text style={styles.label}>Lead Inspector</Text>
        <TextInput style={styles.input} placeholder="Inspector name" placeholderTextColor="#94A3B8" />

        <Text style={styles.label}>Additional Inspectors</Text>

        {additionalInspectors.map((inspector, index) => (
          <View key={index} style={styles.inspectorRow}>
            <TextInput
              style={styles.inspectorInput}
              placeholder={`Additional inspector ${index + 1}`}
              placeholderTextColor="#94A3B8"
              value={inspector}
              onChangeText={(value) => {
                const next = [...additionalInspectors];
                next[index] = value;
                setAdditionalInspectors(next);
              }}
            />

            <Pressable
              style={styles.removeInspectorButton}
              onPress={() => {
                setAdditionalInspectors(
                  additionalInspectors.filter((_, i) => i !== index)
                );
              }}
            >
              <Text style={styles.removeInspectorButtonText}>Remove</Text>
            </Pressable>
          </View>
        ))}

        <Pressable
          style={styles.addInspectorButton}
          onPress={() => setAdditionalInspectors([...additionalInspectors, ""])}
        >
          <Text style={styles.addInspectorButtonText}>+ Add Inspector</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.checkboxRow}
        onPress={() => setIsConfidential(!isConfidential)}
      >
        <View style={[styles.checkbox, isConfidential && styles.checkboxChecked]}>
          <Text style={styles.checkboxMark}>{isConfidential ? "✓" : ""}</Text>
        </View>

        <View style={styles.checkboxTextBlock}>
          <Text style={styles.confidentialTitle}>Privileged & Confidential</Text>
          <Text style={styles.confidentialText}>
            Select this option to add a privileged and confidential marking to the generated report.
          </Text>
        </View>
      </Pressable>

      <Link href="/inspection-walkthrough" asChild>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continue to Inspection</Text>
        </Pressable>
      </Link>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    borderLeftWidth: 4,
    borderLeftColor: "#1D72B8",
    paddingLeft: 16,
    marginBottom: 18,
  },
  pageTitle: { color: "#0F172A", fontSize: 28, fontWeight: "900" },
  pageSubtitle: { color: "#64748B", fontSize: 14, lineHeight: 21, marginTop: 6 },
  formSection: {
    marginBottom: 16,
  },
  sectionTitle: { color: "#0F172A", fontSize: 20, fontWeight: "900", marginBottom: 10 },
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
  inspectorRow: {
    gap: 8,
    marginBottom: 12,
  },
  inspectorInput: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    color: "#0F172A",
  },
  removeInspectorButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  removeInspectorButtonText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "900",
  },
  addInspectorButton: {
    alignSelf: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  addInspectorButtonText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },
  checkboxRow: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#DC2626",
  },
  checkboxMark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  checkboxTextBlock: {
    flex: 1,
  },
  confidentialTitle: { color: "#991B1B", fontSize: 14, fontWeight: "900" },
  confidentialText: { color: "#7F1D1D", fontSize: 12, lineHeight: 17, marginTop: 3 },
  primaryButton: {
    backgroundColor: "#1D72B8",
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
});
