import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";

const lifecycle = [
  {
    title: "Inspection Report Builder",
    text: "Create structured safety reports with hazards, evidence, risk ratings, standards, and corrective actions.",
  },
  {
    title: "SafeScope Intelligence",
    text: "Map findings to applicable safety standards and support consistent review decisions.",
  },
  {
    title: "Executive Analytics",
    text: "Track mitigation speed, recurring hazards, audit fatigue, risk exposure, and site maturity.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "For testing the inspection workflow.",
    features: ["Basic reports", "Manual risk scoring", "Limited analytics"],
  },
  {
    name: "Sentinel Pro",
    price: "$49",
    desc: "For professionals managing active safety programs.",
    features: ["SafeScope mapping", "Executive analytics", "Corrective action tracking"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For companies with multiple sites and teams.",
    features: ["Multi-site governance", "Advanced permissions", "Predictive intelligence"],
  },
];

export default function MarketingScreen() {
  return (
    <LayoutContainer showNav={false}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Sentinel Safety</Text>
        <Text style={styles.title}>Modern safety intelligence for serious operations.</Text>
        <Text style={styles.subtitle}>
          Build inspection reports, identify risk trends, and turn safety findings into accountable corrective action.
        </Text>
      </View>

      <View style={styles.lifecycleSection}>
        <Text style={styles.sectionEyebrow}>Platform Workflow</Text>
        <Text style={styles.sectionTitle}>Built for the full inspection lifecycle</Text>

        {lifecycle.map((item, index) => (
          <View key={item.title} style={styles.lifecycleRow}>
            <Text style={styles.lifecycleNumber}>0{index + 1}</Text>

            <View style={styles.lifecycleTextBlock}>
              <Text style={styles.lifecycleTitle}>{item.title}</Text>
              <Text style={styles.lifecycleText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.pricingSection}>
        <Text style={styles.sectionEyebrow}>Plans</Text>
        <Text style={styles.sectionTitle}>Choose the level of safety intelligence you need</Text>

        {plans.map((plan) => (
          <View
            key={plan.name}
            style={[
              styles.planCard,
              plan.name === "Sentinel Pro" && styles.featuredPlan,
            ]}
          >
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planDesc}>{plan.desc}</Text>

            {plan.features.map((feature) => (
              <Text key={feature} style={styles.planFeature}>
                • {feature}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.bottomCta}>
        <Text style={styles.ctaTitle}>Ready to build your safety workspace?</Text>
        <Text style={styles.ctaText}>
          Create an account to start building reports, tracking actions, and using Sentinel Safety intelligence.
        </Text>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </Pressable>

        <Text style={styles.secondaryLink}>Already have an account? Sign in</Text>
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    padding: 26,
    marginBottom: 26,
  },
  eyebrow: {
    color: "#F97316",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "900",
    marginBottom: 12,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
  },
  lifecycleSection: {
    marginBottom: 30,
  },
  sectionEyebrow: {
    color: "#F97316",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "900",
    marginBottom: 18,
  },
  lifecycleRow: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  lifecycleNumber: {
    color: "#CBD5E1",
    fontSize: 30,
    fontWeight: "900",
    width: 46,
  },
  lifecycleTextBlock: {
    flex: 1,
  },
  lifecycleTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },
  lifecycleText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
  },
  pricingSection: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  featuredPlan: {
    borderLeftWidth: 5,
    borderLeftColor: "#F97316",
    backgroundColor: "#FFF7ED",
  },
  planName: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 6,
  },
  planPrice: {
    color: "#0F172A",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 6,
  },
  planDesc: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  planFeature: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  bottomCta: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    width: 220,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  secondaryLink: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 16,
  },
});
