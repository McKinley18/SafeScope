import React from "react";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LayoutContainer from "../components/LayoutContainer";
import AnnotationPreview from "../components/image/AnnotationPreview";
import { getInspectionFindings } from "../state/inspectionSession";

export default function InspectionReviewScreen() {
  const findings = getInspectionFindings();

  const criticalCount = findings.filter(
    (finding) =>
      finding.safeScopeResult?.risk?.riskBand === "Critical" ||
      finding.safeScopeResult?.risk?.requiresShutdown
  ).length;

  return (
    <LayoutContainer>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Review</Text>
        <Text style={styles.pageSubtitle}>
          Review finalized findings, SafeScope classifications, risk intelligence, evidence, and suggested standards before generating the final report.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Report Intelligence Summary</Text>
        <Text style={styles.bodyText}>Findings: {findings.length}</Text>
        <Text style={styles.bodyText}>Critical / shutdown recommendations: {criticalCount}</Text>
      </View>

      {findings.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>No Findings Found</Text>
          <Text style={styles.bodyText}>
            Return to the walkthrough and save at least one finding before generating a report.
          </Text>
        </View>
      ) : (
        findings.map((finding, index) => (
          <View key={finding.id || index} style={styles.findingCard}>
            <Text style={styles.findingTitle}>
              Finding {index + 1}: {finding.hazardCategory || "Uncategorized"}
            </Text>

            <Text style={styles.bodyText}>{finding.description || "No description provided."}</Text>

            {!!finding.location && (
              <Text style={styles.metaText}>Location: {finding.location}</Text>
            )}

            {finding.safeScopeResult && (
              <View style={styles.intelBox}>
                <Text style={styles.intelTitle}>
                  SafeScope: {finding.safeScopeResult.classification}
                </Text>
                <Text style={styles.metaText}>
                  Confidence: {Math.round((finding.safeScopeResult.confidence || 0) * 100)}% ({finding.safeScopeResult.confidenceBand})
                </Text>

                {finding.safeScopeResult.ambiguityWarnings?.map((warning: string, warningIndex: number) => (
                  <Text key={warningIndex} style={styles.warningText}>⚠ {warning}</Text>
                ))}

                {finding.safeScopeResult.risk && (
                  <View style={styles.riskBox}>
                    <Text style={styles.riskTitle}>
                      Risk: {finding.safeScopeResult.risk.riskBand} ({finding.safeScopeResult.risk.riskScore})
                    </Text>
                    <Text style={styles.metaText}>
                      Fatality Potential: {finding.safeScopeResult.risk.fatalityPotential}
                    </Text>

                    {finding.safeScopeResult.risk.imminentDanger && (
                      <Text style={styles.dangerText}>Imminent danger indicators detected.</Text>
                    )}

                    {finding.safeScopeResult.risk.requiresShutdown && (
                      <Text style={styles.dangerText}>Shutdown / immediate control recommended.</Text>
                    )}

                    {finding.safeScopeResult.risk.reasoning?.map((reason: string, reasonIndex: number) => (
                      <Text key={reasonIndex} style={styles.metaText}>• {reason}</Text>
                    ))}
                  </View>
                )}

                {finding.safeScopeResult.additionalHazards?.length ? (
                  <View style={styles.additionalHazardsBox}>
                    <Text style={styles.additionalHazardsTitle}>Additional Hazards</Text>
                    {finding.safeScopeResult.additionalHazards.map((hazard: any, hazardIndex: number) => (
                      <View key={`${hazard.classification}-${hazardIndex}`} style={styles.additionalHazardCard}>
                        <Text style={styles.additionalHazardName}>
                          {hazard.classification} • {hazard.risk?.riskBand || hazard.confidenceBand}
                        </Text>
                        <Text style={styles.metaText}>
                          Evidence: {hazard.evidenceTokens?.join(", ") || "None"}
                        </Text>
                        {hazard.suggestedStandards?.map((standard: any) => (
                          <Text key={standard.citation} style={styles.metaText}>
                            {standard.citation}: {standard.rationale}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                ) : null}

                {finding.safeScopeResult.generatedActions?.length ? (
                  <View style={styles.generatedActionsBox}>
                    <Text style={styles.generatedActionsTitle}>Corrective Actions</Text>
                    {finding.safeScopeResult.generatedActions.map((action: any, actionIndex: number) => (
                      <View key={`${action.title}-${actionIndex}`} style={styles.generatedActionCard}>
                        <View style={styles.generatedActionHeader}>
                          <Text style={styles.generatedActionName}>{action.title}</Text>
                          <View style={styles.priorityBadge}>
                            <Text style={styles.priorityBadgeText}>{action.priority}</Text>
                          </View>
                        </View>


                        {action.requiresShutdown && (
                          <Text style={styles.dangerText}>Immediate shutdown / isolation recommended.</Text>
                        )}

                        {!!action.referenceStandards?.length && (
                          <Text style={styles.metaText}>Standards: {action.referenceStandards.join(", ")}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                ) : null}

                {finding.safeScopeResult.additionalHazards?.some((hazard: any) => hazard.generatedActions?.length) ? (
                  <View style={styles.generatedActionsBox}>
                    <Text style={styles.generatedActionsTitle}>Additional Hazard Corrective Actions</Text>
                    {finding.safeScopeResult.additionalHazards.map((hazard: any, hazardIndex: number) =>
                      hazard.generatedActions?.map((action: any, actionIndex: number) => (
                        <View key={`${hazard.classification}-${action.title}-${actionIndex}`} style={styles.generatedActionCard}>
                          <Text style={styles.additionalHazardName}>{hazard.classification}</Text>

                          <View style={styles.generatedActionHeader}>
                            <Text style={styles.generatedActionName}>{action.title}</Text>
                            <View style={styles.priorityBadge}>
                              <Text style={styles.priorityBadgeText}>{action.priority}</Text>
                            </View>
                          </View>

                              </View>
                      ))
                    )}
                  </View>
                ) : null}

                {finding.safeScopeResult.suggestedStandards?.map((standard: any) => (
                  <View key={standard.citation} style={styles.standardCard}>
                    <Text style={styles.standardCitation}>{standard.citation}</Text>
                    <Text style={styles.metaText}>{standard.rationale}</Text>
                  </View>
                ))}
              </View>
            )}

            {finding.photos?.length > 0 && (
              <View style={styles.photoGrid}>
                {finding.photos.map((photo: any, photoIndex: number) => (
                  <AnnotationPreview
                    key={`${photo.originalUri}-${photoIndex}`}
                    photoUri={photo.originalUri}
                    annotations={photo.annotations || []}
                  />
                ))}
              </View>
            )}
          </View>
        ))
      )}

      <View style={styles.actionRow}>
        <Link href="/inspection-walkthrough" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Back to Inspection</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Generate PDF Report</Text>
        </Pressable>
      </View>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  bodyText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
  },
  metaText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  findingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  findingTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  intelBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginTop: 12,
  },
  intelTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  warningText: {
    color: "#B45309",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },
  riskBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDBA74",
    padding: 10,
    marginTop: 10,
  },
  riskTitle: {
    color: "#9A3412",
    fontSize: 14,
    fontWeight: "900",
  },
  dangerText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 6,
  },
  standardCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    marginTop: 8,
  },
  standardCitation: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "900",
  },
  photoGrid: {
    gap: 10,
    marginTop: 12,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },
  primaryButton: {
    backgroundColor: "#1D72B8",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  additionalHazardsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 10,
    marginTop: 10,
  },
  additionalHazardsTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 6,
  },
  additionalHazardCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 8,
    marginBottom: 8,
  },
  additionalHazardName: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },

  generatedActionsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 10,
    marginTop: 10,
  },
  generatedActionsTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  generatedActionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    marginBottom: 8,
  },
  generatedActionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  generatedActionName: {
    flex: 1,
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },
  priorityBadge: {
    backgroundColor: "#0F172A",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priorityBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
});
