import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import LayoutContainer from "../components/LayoutContainer";
import AnnotationEditor from "../components/image/AnnotationEditor";
import AnnotationPreview from "../components/image/AnnotationPreview";
import { setInspectionFindings } from "../state/inspectionSession";
import {
  runSafeScopeMatch,
  runSafeScopeV2Classify,
  sendSafeScopeFeedback,
  SafeScopeStandardMatch,
  SafeScopeV2Result,
} from "../lib/safescopeApi";

const steps = [
  { title: "Step 1: Identify Hazards", desc: "Document the hazard observed." },
  { title: "Step 2: Take Photos", desc: "Capture or attach evidence." },
  { title: "Step 3: Regulation", desc: "Review likely standards." },
  { title: "Step 4: Risk Assessment", desc: "Rate severity and likelihood." },
  { title: "Step 5: Corrective Actions", desc: "Define the fix." },
  { title: "Step 6: Finalize", desc: "Review and generate the report." },
];

const severityScale = [
  { score: 1, label: "Minor", desc: "First aid or low-impact condition." },
  { score: 2, label: "Moderate", desc: "Medical treatment or limited damage possible." },
  { score: 3, label: "Serious", desc: "Lost time injury or significant equipment damage possible." },
  { score: 4, label: "Major", desc: "Permanent injury, major damage, or regulatory exposure." },
  { score: 5, label: "Critical", desc: "Fatality, catastrophic injury, or imminent danger." },
];

const likelihoodScale = [
  { score: 1, label: "Rare", desc: "Not expected under normal conditions." },
  { score: 2, label: "Unlikely", desc: "Could happen, but not often." },
  { score: 3, label: "Possible", desc: "Could reasonably happen during work." },
  { score: 4, label: "Likely", desc: "Expected to happen if not corrected." },
  { score: 5, label: "Frequent", desc: "Happening now or repeatedly likely." },
];

export default function InspectionWalkthroughScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [hazardCategory, setHazardCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [photos, setPhotos] = useState<any[]>([]);
  const [annotatingPhotoIndex, setAnnotatingPhotoIndex] = useState<number | null>(null);
  const [annotationExpanded, setAnnotationExpanded] = useState(false);
  const [agencyMode, setAgencyMode] = useState<"all" | "msha" | "osha_general" | "osha_construction">("all");

  const [findings, setFindings] = useState<any[]>([]);
  const [editingFindingIndex, setEditingFindingIndex] = useState<number | null>(null);
  const [currentFindingSaved, setCurrentFindingSaved] = useState(false);
  const [matches, setMatches] = useState<SafeScopeStandardMatch[]>([]);
  const [safeScopeStatus, setSafeScopeStatus] = useState("");
  const [safeScopeResult, setSafeScopeResult] = useState<SafeScopeV2Result | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");

  const [severity, setSeverity] = useState<number | null>(null);
  const [likelihood, setLikelihood] = useState<number | null>(null);

  const riskScore = severity && likelihood ? severity * likelihood : null;

  const buildSafeScopeText = () => {
    return [
      `Hazard category: ${hazardCategory || "Unspecified"}`,
      `Observed condition: ${description || "No description provided"}`,
      `Location: ${location || "No location provided"}`,
      `Evidence notes: ${evidenceNotes || "No evidence notes provided"}`,
      `Regulatory scope: ${agencyMode.toUpperCase()}`,
    ].join("\n");
  };

  const resetCurrentFinding = () => {
    setCurrentStep(1);
    setHazardCategory("");
    setDescription("");
    setLocation("");
    setEvidenceNotes("");
    setPhotos([]);
    setMatches([]);
    setSafeScopeStatus("");
    setSafeScopeResult(null);
    setFeedbackNotes("");
    setSeverity(null);
    setLikelihood(null);
    setCurrentFindingSaved(false);
  };

  const buildCurrentFinding = () => ({
    id: editingFindingIndex !== null ? findings[editingFindingIndex]?.id : `${Date.now()}-${Math.random()}`,
    hazardCategory,
    description,
    location,
    evidenceNotes,
    photos,
    agencyMode,
    matches,
    safeScopeResult,
    severity,
    likelihood,
    riskScore,
  });

  const hasCurrentFindingData = () =>
    !!(
      hazardCategory ||
      description ||
      location ||
      evidenceNotes ||
      photos.length ||
      matches.length ||
      severity ||
      likelihood
    );

  const upsertCurrentFinding = () => {
    if (!hasCurrentFindingData()) return findings;

    const current = buildCurrentFinding();

    if (editingFindingIndex !== null) {
      return findings.map((finding, index) =>
        index === editingFindingIndex ? current : finding
      );
    }

    return [...findings, current];
  };

  const handleSaveFinding = () => {
    if (!currentFindingSaved) {
      setFindings(upsertCurrentFinding());
      setCurrentFindingSaved(true);
    }
    setEditingFindingIndex(null);
  };

  const handleAddFinding = () => {
    if (!currentFindingSaved) {
      setFindings(upsertCurrentFinding());
    }
    setEditingFindingIndex(null);
    resetCurrentFinding();
  };

  const handleEditFinding = (index: number) => {
    const finding = findings[index];
    if (!finding) return;

    setHazardCategory(finding.hazardCategory || "");
    setDescription(finding.description || "");
    setLocation(finding.location || "");
    setEvidenceNotes(finding.evidenceNotes || "");
    setPhotos(finding.photos || []);
    setAgencyMode(finding.agencyMode || "all");
    setMatches(finding.matches || []);
    setSafeScopeResult(finding.safeScopeResult || null);
    setSeverity(finding.severity || null);
    setLikelihood(finding.likelihood || null);
    setEditingFindingIndex(index);
    setCurrentFindingSaved(true);
    setCurrentStep(1);
  };

  const handleDeleteFinding = (index: number) => {
    setFindings(findings.filter((_, i) => i !== index));
    if (editingFindingIndex === index) {
      setEditingFindingIndex(null);
      resetCurrentFinding();
    }
  };

  const handleGenerateReport = () => {
    const finalizedFindings = upsertCurrentFinding();
    setFindings(finalizedFindings);
    setInspectionFindings(finalizedFindings);
    router.push("/inspection-review");
  };

  const handleRunSafeScope = async () => {
    try {
      setSafeScopeStatus("Running SafeScope match...");
      const selectedScopes = agencyMode === "all" ? undefined : [agencyMode];
      const result = await runSafeScopeV2Classify(buildSafeScopeText(), selectedScopes);
      setSafeScopeResult(result);

      setMatches(
        result.suggestedStandards.map((standard) => ({
          citation: standard.citation,
          description: standard.rationale,
          confidence: result.confidence,
        }))
      );

      setSafeScopeStatus(
        `SafeScope v2: ${result.classification} (${result.confidenceBand} confidence)`
      );
    } catch (error) {
      setSafeScopeStatus(
        error instanceof Error ? error.message : "SafeScope request failed."
      );
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      setSafeScopeStatus("Camera permission is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setPhotos([...photos, { originalUri: result.assets[0].uri, annotations: [] }]);
    }
  };

  const handleUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setSafeScopeStatus("Photo library permission is required to upload photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setPhotos([...photos, ...result.assets.map((asset) => ({ originalUri: asset.uri, annotations: [] }))]);
    }
  };

  const handleFeedback = async (
    match: SafeScopeStandardMatch,
    action: "accepted" | "rejected" | "changed" | "flagged"
  ) => {
    try {
      setSafeScopeStatus(`Submitting ${action} feedback...`);

      await sendSafeScopeFeedback({
        text: buildSafeScopeText(),
        category: hazardCategory || "General",
        mode: agencyMode,
        citation: match.citation,
        action,
        notes: feedbackNotes,
      });

      setSafeScopeStatus(`Feedback saved: ${action} ${match.citation}`);
    } catch (error) {
      setSafeScopeStatus(
        error instanceof Error ? error.message : "Feedback request failed."
      );
    }
  };

  return (
    <LayoutContainer>
      <View style={styles.topStepBar}>
        <Pressable
          style={styles.topBackButton}
          onPress={() => {
            if (currentStep === 1) {
              router.push("/inspection-cover");
              return;
            }

            setCurrentStep(Math.max(1, currentStep - 1));
          }}
        >
          <Text style={styles.topBackButtonText}>← Back</Text>
        </Pressable>

        <Text style={styles.topStepText}>Step {currentStep} of {steps.length}</Text>
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>{steps[currentStep - 1].title}</Text>
        <Text style={styles.pageSubtitle}>{steps[currentStep - 1].desc}</Text>
      </View>

      <View style={styles.workflowBar}>
        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isComplete = currentStep > index + 1;

          return (
            <View key={index} style={styles.workflowStep}>
              <View
                style={[
                  styles.workflowIndicator,
                  isActive && styles.workflowIndicatorActive,
                  isComplete && styles.workflowIndicatorComplete,
                ]}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        {currentStep === 1 && (
          <>
            <Text style={styles.sectionTitle}>Hazard Identification</Text>

            <Text style={styles.label}>Hazard Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: Electrical, fall protection, guarding"
              placeholderTextColor="#94A3B8"
              value={hazardCategory}
              onChangeText={setHazardCategory}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textarea}
              multiline
              placeholder="Describe the hazard, where it was found, who may be exposed, and what condition exists."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: Conveyor 3, north catwalk"
              placeholderTextColor="#94A3B8"
              value={location}
              onChangeText={setLocation}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <Text style={styles.sectionTitle}>Evidence Capture</Text>

            <View style={styles.uploadBox}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadTitle}>Evidence Photos</Text>
              <Text style={styles.uploadText}>
                Take photos in the field or upload existing evidence images.
              </Text>

              <View style={styles.photoButtonRow}>
                <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </Pressable>

                <Pressable style={styles.photoButtonSecondary} onPress={handleUploadPhoto}>
                  <Text style={styles.photoButtonSecondaryText}>Upload Photo</Text>
                </Pressable>
              </View>
            </View>

            {photos.length > 0 && (
              <View style={styles.photoGrid}>
                {photos.map((photo, index) => (
                  <View key={`${photo.originalUri}-${index}`} style={styles.photoItem}>
                    <AnnotationPreview photoUri={photo.originalUri} annotations={photo.annotations || []} />

                    <View style={styles.photoActionRow}>
                      <Pressable
                        style={styles.annotateButton}
                        onPress={() => {
                          setAnnotatingPhotoIndex(index);
                          setAnnotationExpanded(false);
                        }}
                      >
                        <Text style={styles.annotateButtonText}>Annotate</Text>
                      </Pressable>

                      <Pressable
                        style={styles.removePhotoButton}
                        onPress={() => {
                          setPhotos(photos.filter((_, i) => i !== index));
                        }}
                      >
                        <Text style={styles.removePhotoButtonText}>Remove</Text>
                      </Pressable>
                    </View>

                    {annotatingPhotoIndex === index && (
                      <View style={annotationExpanded ? styles.annotationExpandedPanel : styles.annotationInlinePanel}>
                        <Pressable
                          style={styles.expandAnnotationButton}
                          onPress={() => setAnnotationExpanded(!annotationExpanded)}
                        >
                          <Text style={styles.expandAnnotationButtonText}>
                            {annotationExpanded ? "Collapse" : "Expand"}
                          </Text>
                        </Pressable>

                        <AnnotationEditor
                          photoUri={photo.originalUri}
                          annotations={photo.annotations || []}
                          onSave={(annotations) => {
                            const next = [...photos];
                            next[index] = { ...photo, annotations };
                            setPhotos(next);
                            setAnnotatingPhotoIndex(null);
                            setAnnotationExpanded(false);
                          }}
                          onCancel={() => {
                            setAnnotatingPhotoIndex(null);
                            setAnnotationExpanded(false);
                          }}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.label}>Evidence Notes</Text>
            <TextInput
              style={styles.textarea}
              multiline
              placeholder="Describe photos, documents, or evidence needed."
              placeholderTextColor="#94A3B8"
              value={evidenceNotes}
              onChangeText={setEvidenceNotes}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <Text style={styles.sectionTitle}>SafeScope Regulation Mapping</Text>

            <Text style={styles.infoBox}>
              SafeScope uses the hazard category, description, location, evidence notes, and selected agency mode to suggest likely standards. Suggestions must be reviewed by a qualified safety professional.
            </Text>

            <Text style={styles.label}>Applicable Regulations</Text>
            <View style={styles.roleRow}>
              {[
                { label: "All", value: "all" },
                { label: "MSHA", value: "msha" },
                { label: "OSHA General", value: "osha_general" },
                { label: "OSHA Construction", value: "osha_construction" },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  style={agencyMode === option.value ? styles.roleBadgeActive : styles.roleBadge}
                  onPress={() => setAgencyMode(option.value as any)}
                >
                  <Text
                    style={
                      agencyMode === option.value
                        ? styles.roleBadgeActiveText
                        : styles.roleBadgeText
                    }
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.generateButton} onPress={handleRunSafeScope}>
              <Text style={styles.generateButtonText}>Run SafeScope Match</Text>
            </Pressable>

            {!!safeScopeStatus && (
              <Text style={styles.statusText}>{safeScopeStatus}</Text>
            )}

            {safeScopeResult?.risk && (
              <View style={styles.riskPanel}>
                <Text style={styles.riskTitle}>SafeScope Risk Intelligence</Text>

                {safeScopeResult.risk.operationalRisk && (
                  <View style={styles.riskSplitCard}>
                    <Text style={styles.riskSplitTitle}>Operational Matrix</Text>
                    <Text style={styles.riskText}>
                      Severity {safeScopeResult.risk.operationalRisk.severity} × Likelihood {safeScopeResult.risk.operationalRisk.likelihood}
                    </Text>
                    <Text style={styles.riskText}>
                      Score: {safeScopeResult.risk.operationalRisk.matrixScore} • {safeScopeResult.risk.operationalRisk.matrixBand}
                    </Text>
                  </View>
                )}

                <View style={styles.riskSplitCard}>
                  <Text style={styles.riskSplitTitle}>AI Escalation</Text>
                  <Text style={styles.riskText}>
                    Score: {safeScopeResult.risk.aiRisk?.escalationScore ?? safeScopeResult.risk.riskScore} • {safeScopeResult.risk.aiRisk?.escalationBand ?? safeScopeResult.risk.riskBand}
                  </Text>
                  <Text style={styles.riskText}>
                    Fatality Potential: {safeScopeResult.risk.aiRisk?.fatalityPotential ?? safeScopeResult.risk.fatalityPotential}
                  </Text>
                </View>

                {safeScopeResult.risk.imminentDanger && (
                  <Text style={styles.riskWarning}>Imminent danger indicators detected.</Text>
                )}

                {safeScopeResult.risk.requiresShutdown && (
                  <Text style={styles.riskWarning}>Shutdown / immediate control recommended.</Text>
                )}

                {(safeScopeResult.risk.aiRisk?.escalationReasons || safeScopeResult.risk.reasoning)?.map((reason, index) => (
                  <Text key={index} style={styles.riskReasoning}>• {reason}</Text>
                ))}
              </View>
            )}

            {safeScopeResult?.additionalHazards?.length ? (
              <View style={styles.additionalHazardsBox}>
                <Text style={styles.additionalHazardsTitle}>Additional Hazards Detected</Text>
                {safeScopeResult.additionalHazards.map((hazard, index) => (
                  <View key={`${hazard.classification}-${index}`} style={styles.additionalHazardCard}>
                    <Text style={styles.additionalHazardName}>
                      {hazard.classification} • {hazard.risk?.riskBand || hazard.confidenceBand}
                    </Text>
                    <Text style={styles.additionalHazardMeta}>
                      Evidence: {hazard.evidenceTokens?.join(", ") || "None"}
                    </Text>
                    {hazard.suggestedStandards?.map((standard) => (
                      <Text key={standard.citation} style={styles.additionalHazardMeta}>
                        {standard.citation}: {standard.rationale}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            ) : null}

            {safeScopeResult?.excludedStandards?.length ? (
              <View style={styles.excludedStandardsBox}>
                <Text style={styles.excludedStandardsTitle}>Filtered Out</Text>
                {safeScopeResult.excludedStandards.map((standard) => (
                  <Text key={standard.citation} style={styles.excludedStandardsText}>
                    {standard.citation}: {standard.reason}
                  </Text>
                ))}
              </View>
            ) : null}

            {matches.map((match) => (
              <View key={match.citation} style={styles.matchCard}>
                <Text style={styles.matchCitation}>{match.citation}</Text>
                <Text style={styles.matchDescription}>{match.description}</Text>
                <Text style={styles.matchConfidence}>
                  Confidence: {Math.round(match.confidence * 100)}%
                </Text>

                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Optional feedback notes for this suggestion"
                  placeholderTextColor="#94A3B8"
                  value={feedbackNotes}
                  onChangeText={setFeedbackNotes}
                />

                <View style={styles.feedbackRow}>
                  <Pressable
                    style={styles.feedbackButton}
                    onPress={() => handleFeedback(match, "accepted")}
                  >
                    <Text style={styles.feedbackButtonText}>Accept</Text>
                  </Pressable>

                  <Pressable
                    style={styles.feedbackButtonMuted}
                    onPress={() => handleFeedback(match, "rejected")}
                  >
                    <Text style={styles.feedbackButtonMutedText}>Reject</Text>
                  </Pressable>

                  <Pressable
                    style={styles.feedbackButtonMuted}
                    onPress={() => handleFeedback(match, "flagged")}
                  >
                    <Text style={styles.feedbackButtonMutedText}>Flag</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        )}

        {currentStep === 4 && (
          <>
            <Text style={styles.sectionTitle}>Risk Assessment</Text>
            <Text style={styles.helpText}>
              Select 1–5 for severity and likelihood. Higher numbers mean greater risk.
            </Text>

            <Text style={styles.scaleTitle}>Severity: How bad could the outcome be?</Text>
            {severityScale.map((item) => (
              <Pressable
                key={item.score}
                style={[
                  styles.scaleOption,
                  severity === item.score && styles.scaleOptionSelected,
                ]}
                onPress={() => setSeverity(item.score)}
              >
                <Text style={styles.scaleScore}>{item.score}</Text>
                <View style={styles.scaleTextBlock}>
                  <Text style={styles.scaleLabel}>{item.label}</Text>
                  <Text style={styles.scaleDesc}>{item.desc}</Text>
                </View>
              </Pressable>
            ))}

            <Text style={styles.scaleTitle}>Likelihood: How likely is it to happen?</Text>
            {likelihoodScale.map((item) => (
              <Pressable
                key={item.score}
                style={[
                  styles.scaleOption,
                  likelihood === item.score && styles.scaleOptionSelected,
                ]}
                onPress={() => setLikelihood(item.score)}
              >
                <Text style={styles.scaleScore}>{item.score}</Text>
                <View style={styles.scaleTextBlock}>
                  <Text style={styles.scaleLabel}>{item.label}</Text>
                  <Text style={styles.scaleDesc}>{item.desc}</Text>
                </View>
              </Pressable>
            ))}

            <View style={styles.riskScoreBox}>
              <Text style={styles.riskScoreLabel}>Calculated Risk Score</Text>
              <Text style={styles.riskScoreValue}>
                {riskScore ? `${riskScore} / 25` : "Select severity and likelihood"}
              </Text>
            </View>
          </>
        )}

        {currentStep === 5 && (
          <>
            <Text style={styles.sectionTitle}>Corrective Actions</Text>

            <Text style={styles.label}>Recommended Corrective Action</Text>
            <TextInput
              style={styles.textarea}
              multiline
              placeholder="Describe what needs to be repaired, replaced, guarded, trained, or removed."
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Responsible Person</Text>
            <TextInput
              style={styles.input}
              placeholder="Assigned owner"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Priority / Due Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: High priority / 7 days"
              placeholderTextColor="#94A3B8"
            />
          </>
        )}

        {currentStep === 6 && (
          <>
            <Text style={styles.sectionTitle}>Finalize Report</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Inspection Report Preview</Text>
              <Text style={styles.summaryText}>
                This step will compile the hazard, evidence, SafeScope standard suggestions, risk score, and corrective action into a finished report.
              </Text>
            </View>

            <View style={styles.finalActionRow}>
              <Pressable style={styles.saveButton} onPress={handleSaveFinding}>
                <Text style={styles.finalActionButtonText}>Save</Text>
              </Pressable>

              <Pressable style={styles.addFindingButton} onPress={handleAddFinding}>
                <Text style={styles.finalActionButtonText}>Add Finding</Text>
              </Pressable>

            </View>

            <Text style={styles.findingsCount}>
              Findings: {findings.length}
            </Text>
          </>
        )}
      </View>

      <View style={styles.entriesPanel}>
        {!currentFindingSaved && (
          <>
            <Text style={styles.entriesTitle}>Current Entry</Text>
            <Text style={styles.entriesText}>
              {description || hazardCategory || location
                ? `${hazardCategory || "Uncategorized"} • ${description || "No description yet"}`
                : "Start entering finding details to build the current entry."}
            </Text>
            <Text style={styles.entriesMeta}>
              Photos: {photos.length} • Risk: {safeScopeResult?.risk?.riskBand || riskScore || "Not rated"} • Standards: {matches.length}
            </Text>
          </>
        )}

        {currentStep === 6 && (
          <>
            <Text style={styles.entriesTitle}>Saved Findings</Text>

            {findings.length === 0 ? (
              <Text style={styles.entriesEmpty}>No saved findings yet.</Text>
            ) : (
              findings.map((finding, index) => (
                <View key={finding.id || index} style={styles.findingCard}>
                  <Text style={styles.findingTitle}>Finding {index + 1}: {finding.hazardCategory || "Uncategorized"}</Text>
                  <View style={styles.findingCompactRow}>
                    {finding.photos?.[0] && (
                      <View style={styles.findingThumbnail}>
                        <AnnotationPreview
                          photoUri={finding.photos[0].originalUri}
                          annotations={finding.photos[0].annotations || []}
                        />
                      </View>
                    )}

                    <View style={styles.findingDetailBlock}>
                      <Text style={styles.findingText}>{finding.description || "No description provided."}</Text>
                      {!!finding.location && (
                        <Text style={styles.findingMeta}>Location: {finding.location}</Text>
                      )}
                      <Text style={styles.findingMeta}>
                        SafeScope: {finding.safeScopeResult?.classification || "Not run"} • Risk: {finding.safeScopeResult?.risk?.riskBand || finding.riskScore || "Not rated"}
                      </Text>
                      <Text style={styles.findingMeta}>
                        Photos: {finding.photos?.length || 0} • Standards: {finding.matches?.length || 0}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.findingActionRow}>
                    <Pressable style={styles.editFindingButton} onPress={() => handleEditFinding(index)}>
                      <Text style={styles.editFindingButtonText}>Edit</Text>
                    </Pressable>

                    <Pressable style={styles.deleteFindingButton} onPress={() => handleDeleteFinding(index)}>
                      <Text style={styles.deleteFindingButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </View>

      <View style={styles.footerButtons}>
        <Pressable
          style={[styles.navButtonSecondary, currentStep === 1 && styles.disabledButton]}
          onPress={() => {
            if (currentStep === 1) {
              router.push("/inspection-cover");
              return;
            }

            setCurrentStep(Math.max(1, currentStep - 1));
          }}
        >
          <Text style={styles.navButtonSecondaryText}>Back</Text>
        </Pressable>

        {currentStep < 6 ? (
          <Pressable
            style={styles.navButtonPrimary}
            onPress={() => setCurrentStep(Math.min(6, currentStep + 1))}
          >
            <Text style={styles.navButtonPrimaryText}>Next</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.navButtonPrimary}
            onPress={handleGenerateReport}
          >
            <Text style={styles.navButtonPrimaryText}>Generate Report</Text>
          </Pressable>
        )}
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({

  topStepBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  topBackButton: {
    backgroundColor: "#CBD5E1",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  topBackButtonText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
  },
  topStepText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
  },
  pageHeader: {
    borderLeftWidth: 4,
    borderLeftColor: "#0369A1",
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
    marginTop: 6,
  },
  workflowBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 8,
  },
  workflowStep: {
    flex: 1,
    alignItems: "center",
  },
  workflowIndicator: {
    width: "100%",
    height: 4,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    marginBottom: 6,
  },
  workflowIndicatorActive: {
    height: 6,
    backgroundColor: "#0369A1",
  },
  workflowIndicatorComplete: {
    backgroundColor: "#0F172A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0F172A",
  },
  textarea: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 110,
    textAlignVertical: "top",
    color: "#0F172A",
  },
  uploadBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    padding: 24,
    alignItems: "center",
  },
  uploadIcon: {
    fontSize: 34,
  },
  uploadTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8,
  },
  uploadText: {
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 6,
  },
  photoButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  photoButton: {
    backgroundColor: "#0369A1",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  photoButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  photoButtonSecondary: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  photoButtonSecondaryText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },
  photoGrid: {
    gap: 12,
    marginTop: 14,
  },
  photoItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
  },
  photoPreview: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    resizeMode: "contain",
  },
  annotationCount: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },
  photoActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  annotateButton: {
    backgroundColor: "#1D72B8",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  annotateButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  removePhotoButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  removePhotoButtonText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "900",
  },
  infoBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    color: "#475569",
    lineHeight: 21,
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  roleBadgeActive: {
    backgroundColor: "#0369A1",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  roleBadgeActiveText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
  roleBadge: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  roleBadgeText: {
    color: "#334155",
    fontWeight: "900",
    fontSize: 13,
  },
  statusText: {
    color: "#0369A1",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 12,
  },
  matchCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginTop: 14,
  },
  matchCitation: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "900",
  },
  matchDescription: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  matchConfidence: {
    color: "#F97316",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  feedbackInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#0F172A",
    marginTop: 12,
  },
  feedbackRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  feedbackButton: {
    backgroundColor: "#0369A1",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  feedbackButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },
  feedbackButtonMuted: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  feedbackButtonMutedText: {
    color: "#334155",
    fontWeight: "900",
    fontSize: 12,
  },
  helpText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  scaleTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 10,
  },
  scaleOption: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  scaleOptionSelected: {
    borderColor: "#0369A1",
    backgroundColor: "#E0F2FE",
  },
  scaleScore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "900",
  },
  scaleTextBlock: {
    flex: 1,
  },
  scaleLabel: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
  },
  scaleDesc: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  riskScoreBox: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
  },
  riskScoreLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  riskScoreValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  summaryTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 6,
  },
  summaryText: {
    color: "#64748B",
    lineHeight: 21,
  },
  finalActionRow: {
    gap: 10,
    marginTop: 12,
    alignItems: "flex-start",
  },
  saveButton: {
    backgroundColor: "#1D72B8",
    borderRadius: 999,
    width: 180,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addFindingButton: {
    backgroundColor: "#64748B",
    borderRadius: 999,
    width: 180,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  finalActionButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
  findingsCount: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 12,
  },
  generateButton: {
    backgroundColor: "#0F172A",
    borderRadius: 999,
    width: 180,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  navButtonPrimary: {
    minWidth: 140,
    maxWidth: 140,
    backgroundColor: "#0369A1",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
  },
  navButtonSecondary: {
    minWidth: 110,
    maxWidth: 140,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonSecondaryText: {
    color: "#0F172A",
    fontWeight: "900",
    fontSize: 13,
  },
  disabledButton: {
    opacity: 0.45,
  },

  entriesPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 14,
    marginBottom: 14,
  },
  entriesTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },
  entriesText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
  entriesMeta: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 12,
  },
  entriesEmpty: {
    color: "#94A3B8",
    fontSize: 13,
    fontStyle: "italic",
  },
  findingCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 10,
  },
  findingTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },
  findingText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  findingMeta: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },
  findingActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  editFindingButton: {
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  editFindingButtonText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900",
  },
  deleteFindingButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  deleteFindingButtonText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "900",
  },

  riskPanel: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  riskTitle: {
    color: "#9A3412",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  riskSplitCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FED7AA",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  riskSplitTitle: {
    color: "#9A3412",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },
  riskText: {
    color: "#7C2D12",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  riskWarning: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },
  riskReasoning: {
    color: "#7C2D12",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  annotationInlinePanel: {
    marginTop: 10,
  },
  annotationExpandedPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#1D72B8",
    padding: 10,
    marginTop: 10,
  },
  expandAnnotationButton: {
    alignSelf: "flex-end",
    backgroundColor: "#E0F2FE",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  expandAnnotationButtonText: {
    color: "#0369A1",
    fontSize: 12,
    fontWeight: "900",
  },
  findingCompactRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  findingThumbnail: {
    width: 74,
    height: 56,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  findingDetailBlock: {
    flex: 1,
  },

  excludedStandardsBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  excludedStandardsTitle: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
  },
  excludedStandardsText: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },

  additionalHazardsBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  additionalHazardsTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  additionalHazardCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  additionalHazardName: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },
  additionalHazardMeta: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
});
