"use client";

import { secureStorage } from "@/lib/secureStorage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { runSafeScopeV2Classify, sendSafeScopeFeedback } from "@/lib/safescope";
import { getOrganizationSettings, saveWorkspaceReport } from "@/lib/auth";
import { getCoverPage, getReports, setLatestReport, setReports } from "@/lib/reportStorage";
import { getStoredActions, saveStoredActions, type StoredAction } from "@/lib/actionStorage";
import { addActivityEvent } from "@/lib/activityStorage";
import AnnotationPreview from "@/components/evidence/AnnotationPreview";
import AnnotationEditor from "@/components/evidence/AnnotationEditor";
import { deleteEncryptedPhoto, loadEncryptedPhoto, saveEncryptedPhoto } from "@/lib/evidenceStorage";

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

const hazardCategoryOptions = [
  "Machine Guarding",
  "Electrical",
  "Fall Protection",
  "Walking/Working Surfaces",
  "Lockout/Tagout",
  "PPE",
  "Housekeeping",
  "Mobile Equipment",
  "Confined Space",
  "Fire Protection",
  "Hazard Communication",
  "Ergonomics",
  "Material Handling",
  "Emergency Egress",
  "Other",
];

const likelihoodScale = [
  { score: 1, label: "Rare", desc: "Not expected under normal conditions." },
  { score: 2, label: "Unlikely", desc: "Could happen, but not often." },
  { score: 3, label: "Possible", desc: "Could reasonably happen during work." },
  { score: 4, label: "Likely", desc: "Expected to happen if not corrected." },
  { score: 5, label: "Frequent", desc: "Happening now or repeatedly likely." },
];

export default function InspectionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [hazardCategory, setHazardCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [photos, setPhotos] = useState<any[]>([]);
  const [annotatingPhotoIndex, setAnnotatingPhotoIndex] = useState<number | null>(null);
  const [annotationExpanded, setAnnotationExpanded] = useState(false);
  const [agencyMode, setAgencyMode] = useState("all");
  const [riskProfileId, setRiskProfileId] = useState<"simple_4x4" | "standard_5x5" | "advanced_6x6">("standard_5x5");

  useEffect(() => {
    async function loadCompanyRiskProfile() {
      try {
        const settings = await getOrganizationSettings();
        const backendRiskProfile = settings.riskProfileId as
          | "simple_4x4"
          | "standard_5x5"
          | "advanced_6x6"
          | undefined;

        if (backendRiskProfile) {
          setRiskProfileId(backendRiskProfile);
          window.localStorage.setItem("sentinel_company_risk_profile", backendRiskProfile);
          return;
        }
      } catch {
        // Fall back to local workspace setting when offline or signed out.
      }

      const savedRiskProfile = window.localStorage.getItem("sentinel_company_risk_profile") as
        | "simple_4x4"
        | "standard_5x5"
        | "advanced_6x6"
        | null;

      if (savedRiskProfile) setRiskProfileId(savedRiskProfile);
    }

    loadCompanyRiskProfile();
  }, []);
  const [safeScopeStatus, setSafeScopeStatus] = useState("");
  const [safeScopeResult, setSafeScopeResult] = useState<any>(null);
  const [selectedStandards, setSelectedStandards] = useState<any[]>([]);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [severity, setSeverity] = useState<number | null>(null);
  const [likelihood, setLikelihood] = useState<number | null>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [editingFindingIndex, setEditingFindingIndex] = useState<number | null>(null);
  const [currentFindingSaved, setCurrentFindingSaved] = useState(false);
  const [currentSavedFindingId, setCurrentSavedFindingId] = useState<string | number | null>(null);
  const [findingSaveMessage, setFindingSaveMessage] = useState("");
  const [manualActions, setManualActions] = useState<any[]>([]);
  const [selectedGeneratedActions, setSelectedGeneratedActions] = useState<any[]>([]);
  const [manualActionTitle, setManualActionTitle] = useState("");
  const [manualActionPriority, setManualActionPriority] = useState("Medium");
  const [manualActionDue, setManualActionDue] = useState("");
  const [reportValidationMessage, setReportValidationMessage] = useState("");
  const [includeStandardsInReport, setIncludeStandardsInReport] = useState(true);
  const [includeActionsInReport, setIncludeActionsInReport] = useState(true);
  const [includePhotosInReport, setIncludePhotosInReport] = useState(true);
  const [includeSafeScopeNotesInReport, setIncludeSafeScopeNotesInReport] = useState(false);
  const [safeScopeHelpOpen, setSafeScopeHelpOpen] = useState(false);
  const [safeScopeDetailsOpen, setSafeScopeDetailsOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const riskScore = severity && likelihood ? severity * likelihood : null;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(
        "sentinel_inspection_autosave",
        JSON.stringify({
          currentStep,
          hazardCategory,
          description,
          location,
          evidenceNotes,
          agencyMode,
          riskProfileId,
          severity,
          likelihood,
          manualActions,
          selectedGeneratedActions,
          updatedAt: new Date().toISOString(),
        })
      );

      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [
    currentStep,
    hazardCategory,
    description,
    location,
    evidenceNotes,
    agencyMode,
    riskProfileId,
    severity,
    likelihood,
    manualActions,
    selectedGeneratedActions,
  ]);


  useEffect(() => {
    const existing = secureStorage.get("edit_report", null as any);
    if (!existing) return;

    try {
      const report = JSON.parse(existing);

      if (Array.isArray(report.findings)) {
        setFindings(report.findings);
      }

      window.localStorage.setItem("sentinel_editing_report_id", report.id || "");
      secureStorage.remove("edit_report");
    } catch {
      secureStorage.remove("edit_report");
    }
  }, []);

  async function handleRunSafeScope() {
    try {
      setSafeScopeStatus("Running SafeScope match...");
      const result = await runSafeScopeV2Classify({
        text: [
          `Hazard category: ${hazardCategory || "Unspecified"}`,
          `Observed condition: ${description || "No description provided"}`,
          `Location: ${location || "No location provided"}`,
          `Evidence notes: ${evidenceNotes || "No evidence notes provided"}`,
          `Regulatory scope: ${agencyMode.toUpperCase()}`,
        ].join("\n"),
        scopes: agencyMode === "all" ? undefined : [agencyMode],
        riskProfileId,
        evidenceTexts: [
          evidenceNotes,
          location,
          photos.length ? `${photos.length} evidence photo(s) attached` : "",
          ...photos.map((photo, index) => `Photo ${index + 1}: ${photo.name || "evidence photo"}`),
        ].filter(Boolean),
      });

      setSafeScopeResult(result);
      setSelectedStandards([]);
      setSafeScopeStatus(`SafeScope v2: ${result.classification} (${result.confidenceBand} confidence)`);
    } catch (error) {
      setSafeScopeStatus(error instanceof Error ? error.message : "SafeScope request failed.");
    }
  }

  function buildSafeScopeText() {
    return [
      `Hazard category: ${hazardCategory || "Unspecified"}`,
      `Observed condition: ${description || "No description provided"}`,
      `Location: ${location || "No location provided"}`,
      `Evidence notes: ${evidenceNotes || "No evidence notes provided"}`,
      `Regulatory scope: ${agencyMode.toUpperCase()}`,
    ].join("\n");
  }

  function getStandardKey(standard: any) {
    return standard.citation || standard.id || standard.title || JSON.stringify(standard);
  }

  function toggleSelectedStandard(standard: any) {
    const standardKey = getStandardKey(standard);

    setSelectedStandards((current) => {
      const selected = current.some((item) => getStandardKey(item) === standardKey);

      if (selected) {
        return current.filter((item) => getStandardKey(item) !== standardKey);
      }

      return [
        ...current,
        {
          ...standard,
          reviewStatus: "selected_for_report",
          reviewedByUser: true,
        },
      ];
    });
  }

  async function handleFeedback(
    standard: any,
    action: "accepted" | "rejected" | "flagged"
  ) {
    try {
      setSafeScopeStatus(`Submitting ${action} feedback...`);

      await sendSafeScopeFeedback({
        text: buildSafeScopeText(),
        category: safeScopeResult?.classification || hazardCategory || "General",
        mode: agencyMode,
        citation: standard.citation,
        action,
        notes: feedbackNotes,
        confidenceBefore: safeScopeResult?.confidenceIntelligence?.overallConfidence ?? safeScopeResult?.confidence,
        riskProfileId,
      });

      if (action === "accepted") {
        setSelectedStandards((current) => {
          const exists = current.some((item) => item.citation === standard.citation);
          return exists ? current : [...current, standard];
        });
      }

      if (action === "rejected" || action === "flagged") {
        setSelectedStandards((current) =>
          current.filter((item) => item.citation !== standard.citation)
        );
      }

      setSafeScopeStatus(
        action === "accepted"
          ? `Standard selected: ${standard.citation}`
          : `Feedback saved: ${action} ${standard.citation}`
      );
    } catch (error) {
      setSafeScopeStatus("Feedback could not be saved. Please make sure you are signed in and the backend is running.");
    }
  }

  function toggleGeneratedAction(action: any) {
    const actionKey = action.title || action.description || JSON.stringify(action);

    setSelectedGeneratedActions((current) => {
      const alreadySelected = current.some(
        (selected) => (selected.title || selected.description || JSON.stringify(selected)) === actionKey
      );

      if (alreadySelected) {
        return current.filter(
          (selected) => (selected.title || selected.description || JSON.stringify(selected)) !== actionKey
        );
      }

      return [
        ...current,
        {
          ...action,
          source: "SafeScope",
        },
      ];
    });
  }

  function addManualAction() {
    if (!manualActionTitle.trim()) return;

    setManualActions((current) => [
      ...current,
      {
        title: manualActionTitle.trim(),
        priority: manualActionPriority,
        due: manualActionDue || "Not set",
        source: "User",
      },
    ]);

    setManualActionTitle("");
    setManualActionPriority("Medium");
    setManualActionDue("");
  }

  function removeManualAction(indexToRemove: number) {
    setManualActions((current) => current.filter((_, index) => index !== indexToRemove));
  }

  function buildCurrentFinding() {
    const findingId =
      editingFindingIndex !== null
        ? findings[editingFindingIndex]?.id
        : currentSavedFindingId || Date.now();

    const correctiveActions = [...selectedGeneratedActions, ...manualActions].map((action, index) => ({
      ...action,
      id: action.id || `ACT-${findingId}-${index}`,
      title: action.title || action.description || "Corrective action",
      priority: action.priority || "Medium",
      status: action.status || "Open",
      due: action.due || action.dueDate || "",
      source: action.source || (index < selectedGeneratedActions.length ? "SafeScope" : "User"),
      createdAt: action.createdAt || new Date().toISOString(),
    }));

    return {
      id: findingId,
      hazardCategory,
      description,
      location,
      evidenceNotes,
      photos,
      safeScopeResult,
      selectedStandards,
      selectedGeneratedActions,
      manualActions,
      correctiveActions,
      correctiveActionIds: correctiveActions.map((action) => action.id),
      severity,
      likelihood,
      riskScore,
    };
  }

  async function persistFindingActions(finding: any) {
    const correctiveActions = finding.correctiveActions || [];

    if (!correctiveActions.length) return;

    const storedActions = await getStoredActions();

    const normalizedActions: StoredAction[] = correctiveActions.map((action: any, index: number) => ({
      id: action.id || `ACT-${finding.id}-${index}`,
      title: action.title || action.description || "Corrective action",
      priority: action.priority || "Medium",
      status: action.status || "Open",
      due: action.due || action.dueDate || "",
      source: action.source || "Inspection",
      location: finding.location || "Field Inspection",
      findingTitle:
        finding.hazardCategory ||
        finding.safeScopeResult?.classification ||
        finding.description ||
        "Inspection Finding",
      createdAt: action.createdAt || new Date().toISOString(),
    }));

    const merged = [
      ...normalizedActions,
      ...storedActions.filter(
        (storedAction) =>
          !normalizedActions.some((action) => action.id === storedAction.id)
      ),
    ];

    await saveStoredActions(merged);
  }

  function hasCurrentFindingData() {
    return !!(
      description ||
      hazardCategory ||
      location ||
      evidenceNotes ||
      photos.length ||
      safeScopeResult ||
      selectedStandards.length ||
      selectedGeneratedActions.length ||
      manualActions.length ||
      severity ||
      likelihood
    );
  }

  function resetCurrentFinding() {
    setCurrentStep(1);
    setHazardCategory("");
    setDescription("");
    setLocation("");
    setEvidenceNotes("");
    setPhotos([]);
    setAgencyMode("all");
    setSafeScopeStatus("");
    setSafeScopeResult(null);
    setFeedbackNotes("");
    setSeverity(null);
    setLikelihood(null);
    setEditingFindingIndex(null);
    setCurrentFindingSaved(false);
    setCurrentSavedFindingId(null);
    setFindingSaveMessage("");
    setSelectedGeneratedActions([]);
    setManualActions([]);
    setManualActionTitle("");
    setManualActionPriority("Medium");
    setManualActionDue("");
  }

  async function saveFinding() {
    if (!hasCurrentFindingData()) {
      setFindingSaveMessage("Enter finding details before saving.");
      return;
    }

    const current = buildCurrentFinding();
    await persistFindingActions(current);
    await addActivityEvent({
      type: "Finding",
      title: current.hazardCategory || current.safeScopeResult?.classification || "Finding saved",
      detail: current.location || "Inspection finding updated",
    });

    setFindings((prev) => {
      if (editingFindingIndex !== null) {
        return prev.map((finding, index) =>
          index === editingFindingIndex ? current : finding
        );
      }

      const existingIndex = prev.findIndex((finding) => finding.id === current.id);

      if (existingIndex >= 0) {
        return prev.map((finding) =>
          finding.id === current.id ? current : finding
        );
      }

      return [...prev, current];
    });

    setCurrentSavedFindingId(current.id);
    setCurrentFindingSaved(true);
    setFindingSaveMessage(
      editingFindingIndex !== null || currentFindingSaved
        ? "Saved finding updated."
        : "Finding saved."
    );
  }

  async function addNewFinding() {
    if (!currentFindingSaved && hasCurrentFindingData()) {
      const current = buildCurrentFinding();
      await persistFindingActions(current);
      await addActivityEvent({
        type: "Finding",
        title: current.hazardCategory || current.safeScopeResult?.classification || "Finding saved",
        detail: current.location || "Inspection finding added",
      });
      setFindings((prev) => [...prev, current]);
    }

    resetCurrentFinding();
  }

  function editFinding(index: number) {
    const finding = findings[index];
    if (!finding) return;

    setHazardCategory(finding.hazardCategory || "");
    setDescription(finding.description || "");
    setLocation(finding.location || "");
    setEvidenceNotes(finding.evidenceNotes || "");
    Promise.all((finding.photos || []).map((photo: any) => loadEncryptedPhoto(photo))).then(setPhotos);
    setSafeScopeResult(finding.safeScopeResult || null);
    setSelectedStandards(finding.selectedStandards || []);
    setSelectedGeneratedActions(finding.selectedGeneratedActions || []);
    setManualActions(finding.manualActions || []);
    setSeverity(finding.severity || null);
    setLikelihood(finding.likelihood || null);
    setEditingFindingIndex(index);
    setCurrentSavedFindingId(finding.id || null);
    setFindingSaveMessage("");
    setCurrentFindingSaved(true);
    setCurrentStep(1);
  }



  function getActiveRiskScale() {
    const maxScore =
      riskProfileId === "simple_4x4"
        ? 4
        : riskProfileId === "advanced_6x6"
          ? 6
          : 5;

    return {
      maxScore,
      severity: severityScale.filter((item) => item.score <= maxScore),
      likelihood: likelihoodScale.filter((item) => item.score <= maxScore),
      label:
        riskProfileId === "simple_4x4"
          ? "Simple 4x4"
          : riskProfileId === "advanced_6x6"
            ? "Advanced 6x6"
            : "Standard 5x5",
    };
  }

  function goToInspectionStep(nextStep: number) {
    setCurrentStep(Math.max(1, Math.min(steps.length, nextStep)));

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function deleteFinding(index: number) {
    setFindings((prev) => prev.filter((_, i) => i !== index));
    if (editingFindingIndex === index) {
      resetCurrentFinding();
    }
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    const nextPhotos = await Promise.all(
      files.map((file) => saveEncryptedPhoto(file))
    );

    setPhotos((prev) => [...prev, ...nextPhotos]);
    event.target.value = "";
  }

  function removePhoto(id: string) {
    deleteEncryptedPhoto(id);
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }



  function generateReportId() {
    const year = new Date().getFullYear();
    const shortId = String(Date.now()).slice(-6);
    return `SSR-${year}-${shortId}`;
  }


  function validateReportBeforeGenerate() {
    const finalizedFindings = [...findings];

    if (!currentFindingSaved && hasCurrentFindingData()) {
      finalizedFindings.push(buildCurrentFinding());
    }

    if (!finalizedFindings.length) {
      return "Add at least one finding before generating the report.";
    }

    for (let index = 0; index < finalizedFindings.length; index++) {
      const finding = finalizedFindings[index];
      const label = `Finding ${index + 1}`;

      if (!finding.description?.trim()) {
        return `${label}: Add a hazard description.`;
      }

      if (!finding.severity || !finding.likelihood) {
        return `${label}: Confirm severity and likelihood in Risk Assessment.`;
      }

      const selectedStandards = finding.selectedStandards || [];
      if (!selectedStandards.length) {
        return `${label}: Review and select at least one applicable standard.`;
      }

      const correctiveActions = finding.correctiveActions || [
        ...(finding.selectedGeneratedActions || []),
        ...(finding.manualActions || []),
      ];

      if (!correctiveActions.length) {
        return `${label}: Select or add at least one corrective action.`;
      }
    }

    return "";
  }

  async function generateReport() {
    const validationMessage = validateReportBeforeGenerate();

    if (validationMessage) {
      setReportValidationMessage(validationMessage);
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      });
      return;
    }

    setReportValidationMessage("");

    const finalizedFindings = [...findings];

    if (!currentFindingSaved && hasCurrentFindingData()) {
      finalizedFindings.push(buildCurrentFinding());
    }

    const coverPage = await getCoverPage<any>() || {};

    const report = {
      id: generateReportId(),
      createdAt: new Date().toISOString(),
      title: coverPage.organizationName
        ? `${coverPage.organizationName} Inspection Report`
        : "Inspection Report",
      organizationName: coverPage.organizationName || "",
      siteLocation: coverPage.siteLocation || "",
      inspectionDate: coverPage.inspectionDate || "",
      leadInspector: coverPage.leadInspector || "",
      additionalInspectors: coverPage.additionalInspectors || [],
      isConfidential: !!coverPage.isConfidential,
      includeStandardsInReport,
      includeActionsInReport,
      includePhotosInReport,
      includeSafeScopeNotesInReport,
      findings: finalizedFindings,
    };

    const storageMode =
      (window.localStorage.getItem("sentinel_report_storage_mode") as
        | "local"
        | "cloud"
        | "ask"
        | null) || "local";

    let shouldSaveLocal = storageMode !== "cloud";

    if (storageMode === "ask") {
      shouldSaveLocal = window.confirm(
        "Save this report locally in this browser?\n\nSelect Cancel for cloud-only storage."
      );
    }

    if (shouldSaveLocal) {
      const existingReports = await getReports<any>();

      const nextReports = [
        report,
        ...existingReports.filter((existing: any) => existing.id !== report.id),
      ];

      await setLatestReport(report);
      await setReports(nextReports);
    }

    if (storageMode === "cloud" || storageMode === "ask") {
      try {
        const savedCloudReport = await saveWorkspaceReport(report);
        window.localStorage.setItem("sentinel_latest_cloud_report_id", savedCloudReport.id);
        window.localStorage.setItem(
          "sentinel_latest_report",
          JSON.stringify(savedCloudReport.frontendReportJson || report)
        );
      } catch {
        alert("Report could not be saved to the workspace database. It will be saved locally instead.");

        const existingReports = await getReports<any>();

        const nextReports = [
          report,
          ...existingReports.filter((existing: any) => existing.id !== report.id),
        ];

        await setLatestReport(report);
        await setReports(nextReports);
      }
    }

    await addActivityEvent({
      type: "Report",
      title: `Inspection report ${report.id} generated`,
      detail: `${finalizedFindings.length} finding(s)`,
    });

    router.push("/inspection-review");
  }

  return (
    <>
      <div className="sticky top-[73px] z-30 -mx-4 -mt-5 mb-4 border-b border-white/10 bg-gradient-to-br from-[#0B1320] via-[#102A43] to-[#16324F] px-4 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.18)] sm:-mx-6 sm:px-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl">
              {steps[currentStep - 1].title.replace(/^Step \d+: /, "")}
            </h1>
            <p className="mt-1 text-sm font-semibold text-blue-100">
              {steps[currentStep - 1].desc}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white shadow-sm backdrop-blur">
              Step {currentStep} of {steps.length}
            </div>
            <p className="text-[11px] font-black text-blue-100">
              {lastSavedAt ? `Saved ${lastSavedAt}` : "Autosave ready"}
            </p>
          </div>
        </div>

        <div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1) {
                  router.push("/inspection-cover");
                  return;
                }
                goToInspectionStep(currentStep - 1);
              }}
              className="flex min-h-7 items-center rounded-xl border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentStep === 6) {
                  generateReport();
                  return;
                }
                goToInspectionStep(currentStep + 1);
              }}
              className="flex min-h-7 items-center rounded-xl bg-[#F97316] px-4 py-1 text-[11px] font-black text-white shadow-sm transition hover:bg-orange-500"
            >
              {currentStep === 6 ? "Generate Report" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 hidden gap-2 sm:flex">
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const active = currentStep === stepNumber;
          const complete = currentStep > stepNumber;

          return (
            <div key={stepNumber} className="h-2 flex-1 rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  active || complete ? "bg-[#1D72B8]" : "bg-slate-200"
                }`}
              />
            </div>
          );
        })}
      </div>

      <div className="px-1 py-2 sm:px-2">
        {currentStep === 1 && (
          <>
            <p className="mb-4 text-sm font-semibold leading-6 text-slate-500">
              Capture the hazard, location, and exposure condition. Keep it concise now; SafeScope can expand the context later.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                  Hazard Category
                </label>
                <input
                  list="hazard-category-options"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:border-[#1D72B8] focus:bg-white"
                  placeholder="Choose or type"
                  value={hazardCategory}
                  onChange={(e) => setHazardCategory(e.target.value)}
                />
                <datalist
                  id="hazard-category-options"
                  style={{ maxHeight: "120px" }}
                >
                  {hazardCategoryOptions.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                  Location
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:border-[#1D72B8] focus:bg-white"
                  placeholder="Example: Conveyor 3, north catwalk"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                Observed Condition
              </label>
              <textarea
                className="min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1D72B8] focus:bg-white"
                placeholder="Describe what is wrong, who may be exposed, and whether the condition is active."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
              {hazardCategory && (
                <span className="rounded-full bg-[#E8F4FF] px-3 py-1 text-[#1D72B8]">
                  {hazardCategory}
                </span>
              )}
              {location && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  {location}
                </span>
              )}
              {description && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  Description added
                </span>
              )}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <p className="max-w-xl text-sm font-semibold leading-6 text-slate-500">
                Capture clear visual evidence, then annotate key hazard areas for review and verification.
              </p>

              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-xl bg-[#1D72B8] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#155A93]">
                  Take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>

                <label className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            {photos.length > 0 && (
              <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="overflow-hidden border-b border-slate-200 bg-white pb-3">
                    <AnnotationPreview photoUrl={photo.url} annotations={photo.annotations || []} />

                    <div className="space-y-2 pt-2">
                      <p className="truncate text-xs font-black text-slate-600">{photo.name}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setAnnotatingPhotoIndex(index);
                            setAnnotationExpanded(false);
                          }}
                          className="rounded-lg bg-[#E8F4FF] px-3 py-2 text-xs font-black text-[#1D72B8]"
                        >
                          Annotate
                        </button>

                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      {annotatingPhotoIndex === index && !annotationExpanded && (
                        <div className="mt-3">
                          <button
                            onClick={() => setAnnotationExpanded(true)}
                            className="mb-2 float-right rounded-full bg-[#E0F2FE] px-3 py-2 text-xs font-black text-[#0369A1]"
                          >
                            Expand
                          </button>

                          <div className="clear-both">
                            <AnnotationEditor
                              photoUrl={photo.url}
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
                          </div>
                        </div>
                      )}

                      {annotatingPhotoIndex === index && annotationExpanded && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3">
                          <div className="max-h-[96vh] w-full max-w-6xl overflow-auto rounded-2xl bg-white p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <h3 className="text-base font-black text-slate-900">Photo Annotation</h3>
                              <button
                                onClick={() => setAnnotationExpanded(false)}
                                className="rounded-full bg-slate-300 px-4 py-2 text-xs font-black text-slate-900"
                              >
                                Collapse
                              </button>
                            </div>

                            <AnnotationEditor
                              photoUrl={photo.url}
                              annotations={photo.annotations || []}
                              expanded
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
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Evidence Notes</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1D72B8] focus:bg-white"
              placeholder="Describe photos, documents, or evidence needed."
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <p className="mb-4 text-sm font-semibold leading-6 text-slate-500">
              SafeScope uses the hazard category, description, location, evidence notes, and agency mode to suggest likely standards. Suggestions must be reviewed by a qualified safety professional.
            </p>

            <div className="relative mb-4 flex items-center gap-2">
              <p className="text-sm font-black text-slate-800">
                SafeScope decision-support mode
              </p>

              <button
                type="button"
                onClick={() => setSafeScopeHelpOpen((open) => !open)}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-200 bg-[#E8F4FF] text-xs font-black text-[#1D72B8]"
                aria-label="Explain SafeScope decision-support mode"
              >
                ?
              </button>

              {safeScopeHelpOpen && (
                <div className="absolute left-0 top-8 z-20 max-w-sm rounded-2xl border border-blue-100 bg-white p-4 text-sm font-semibold leading-6 text-slate-600 shadow-xl">
                  <p className="font-black text-slate-900">What this means</p>
                  <p className="mt-1">
                    SafeScope provides decision-support only. Use the results as a review aid. Final standard selection, compliance decisions, and corrective actions remain with qualified personnel.
                  </p>
                </div>
              )}
            </div>

            <label className="mb-2 block text-sm font-black text-slate-700">Applicable Regulations</label>
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["msha", "MSHA"],
                ["osha_general", "OSHA General"],
                ["osha_construction", "OSHA Construction"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setAgencyMode(value)}
                  className={`rounded-full px-4 py-2 text-sm font-black ${
                    agencyMode === value
                      ? "bg-[#1D72B8] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="mb-2 block text-sm font-black text-slate-700">Company Risk Matrix</label>
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
              {riskProfileId === "simple_4x4"
                ? "Simple 4x4"
                : riskProfileId === "advanced_6x6"
                  ? "Advanced 6x6"
                  : "Standard 5x5"} is controlled in Company Settings.
            </div>

            <button
              onClick={handleRunSafeScope}
              className="mb-3 rounded-2xl bg-[#102A43] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0B1F33] active:scale-[0.98]"
            >
              Run SafeScope Match
            </button>

            {safeScopeStatus && <p className="mb-4 text-sm font-black text-slate-600">{safeScopeStatus}</p>}

            {safeScopeResult && (
              <div className="mb-4 border-y border-slate-200 py-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
                      SafeScope Analysis
                    </p>
                    <h3 className="mt-1 text-lg font-black text-slate-900">
                      {safeScopeResult.classification || "Review Required"}
                    </h3>
                  </div>

                  <span className="rounded-full bg-[#E8F4FF] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#1D72B8]">
                    {Math.round(
                      ((safeScopeResult.confidenceIntelligence?.overallConfidence ??
                        safeScopeResult.confidence ??
                        0) || 0) * 100
                    )}% confidence
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Risk
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">
                      {safeScopeResult.risk?.riskBand ||
                        safeScopeResult.risk?.operationalRisk?.matrixBand ||
                        "Not rated"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Environment
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">
                      {safeScopeResult.expandedContext?.environment || "Not inferred"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Review Needed
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">
                      {safeScopeResult.confidenceIntelligence?.supervisorReviewRecommended ||
                      safeScopeResult.requiresHumanReview
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                </div>

                {!!safeScopeResult.confidenceIntelligence?.missingCriticalInformation?.length && (
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                      Missing information
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                      {safeScopeResult.confidenceIntelligence.missingCriticalInformation
                        .slice(0, 3)
                        .join(" • ")}
                    </p>
                  </div>
                )}

                {!!safeScopeResult.confidenceIntelligence?.reviewTriggers?.length && (
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-xs font-black uppercase tracking-wide text-red-700">
                      Supervisor review triggers
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold leading-6 text-slate-600">
                      {safeScopeResult.confidenceIntelligence.reviewTriggers
                        .slice(0, 4)
                        .map((trigger: string) => (
                          <li key={trigger}>{trigger}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {!!safeScopeResult.confidenceIntelligence?.reasonCodes?.length && (
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Confidence reason codes
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {safeScopeResult.confidenceIntelligence.reasonCodes
                        .slice(0, 6)
                        .map((code: string) => (
                          <span
                            key={code}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600"
                          >
                            {code.replaceAll("_", " ")}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {safeScopeResult.risk?.requiresShutdown && (
                  <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700">
                    Shutdown / immediate control recommended.
                  </p>
                )}
              </div>
            )}

            {!!safeScopeResult?.suggestedStandards?.length && (
              <div className="mb-3 border-y border-slate-200 py-3">
                <div className="mb-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
                    Standards Review
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">SafeScope Suggested Standards</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    Select only the standards you want included in the final report. Suggestions are not final until reviewed.
                  </p>
                </div>

                <label className="mb-2 block text-sm font-black text-slate-700">
                  Feedback Notes
                </label>
                <textarea
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Optional notes for accepting, rejecting, or flagging a standard."
                  className="mb-3 min-h-24 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1D72B8] focus:bg-white"
                />
                {safeScopeResult.suggestedStandards.map((standard: any) => {
                  const selected = selectedStandards.some(
                    (item) => getStandardKey(item) === getStandardKey(standard)
                  );

                  return (
                    <div
                      key={standard.citation}
                      className={`mb-3 border-b border-slate-200 py-3 transition ${
                        selected
                          ? "border-[#1D72B8] bg-[#E8F4FF]"
                          : "border-slate-200 bg-transparent hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-black text-[#1D72B8]">{standard.citation}</div>

                        {selected && (
                          <span className="rounded-full bg-[#1D72B8] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                            Selected for Report
                          </span>
                        )}

                        {(Array.isArray(standard.source) ? standard.source : [standard.source]).filter(Boolean).map((source: string) => (
                          <span
                            key={source}
                            className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600"
                          >
                            {source === "cfr_database" ? "CFR Database" : "Curated"}
                          </span>
                        ))}

                        {standard.score !== undefined && (
                          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">
                            Score {standard.score}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-600">{standard.rationale}</p>

                      {standard.workspaceLearningAdjustment !== undefined && standard.workspaceLearningAdjustment !== 0 && (
                        <div className="mt-2 border-l-4 border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
                          Workspace learning adjustment: {standard.workspaceLearningAdjustment > 0 ? "+" : ""}{standard.workspaceLearningAdjustment}
                        </div>
                      )}

                      {!!standard.workspaceLearningWarnings?.length && (
                        <div className="mt-2 border-l-4 border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                          {standard.workspaceLearningWarnings.join(" • ")}
                        </div>
                      )}

                      {!!standard.matchingReasons?.length && (
                        <div className="mt-2 border-l-4 border-slate-200 bg-slate-50 px-3 py-2">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Why SafeScope matched this</p>
                          <p className="mt-1 text-xs font-semibold text-slate-600">
                            {standard.matchingReasons.slice(0, 6).join(" • ")}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            toggleSelectedStandard(standard);
                            if (!selected) handleFeedback(standard, "accepted");
                          }}
                          className={`rounded-full px-3 py-1.5 text-xs font-black ${
                            selected
                              ? "bg-[#1D72B8] text-white"
                              : "bg-[#DCFCE7] text-[#166534]"
                          }`}
                        >
                          {selected ? "Remove from Report" : "Select for Report"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFeedback(standard, "rejected")}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700"
                        >
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFeedback(standard, "flagged")}
                          className="rounded-full bg-[#FEF3C7] px-3 py-1.5 text-xs font-black text-[#92400E]"
                        >
                          Flag
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(!!safeScopeResult?.excludedStandards?.length || !!safeScopeResult?.additionalHazards?.length) && (
              <div className="mb-3 border-y border-slate-200 py-3">
                <button
                  type="button"
                  onClick={() => setSafeScopeDetailsOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
                      Supporting Intelligence
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {safeScopeDetailsOpen ? "Hide secondary SafeScope review details." : "Show excluded standards and additional hazard notes."}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    {safeScopeDetailsOpen ? "Hide" : "Show"}
                  </span>
                </button>

                {safeScopeDetailsOpen && (
                  <div className="mt-3 space-y-4">
                    {!!safeScopeResult?.excludedStandards?.length && (
                      <div>
                        <h3 className="font-black text-slate-700">Excluded Standards</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          These standards were considered but excluded based on selected regulatory scope or context.
                        </p>

                        <div className="mt-2">
                          {safeScopeResult.excludedStandards.map((standard: any) => (
                            <div key={standard.citation} className="border-t border-slate-200 py-2">
                              <p className="font-black text-slate-700">{standard.citation}</p>
                              <p className="mt-1 text-sm text-slate-500">{standard.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!!safeScopeResult?.additionalHazards?.length && (
                      <div>
                        <h3 className="font-black text-slate-900">Additional Hazards Detected</h3>

                        <div className="mt-2">
                          {safeScopeResult.additionalHazards.map((hazard: any, index: number) => (
                            <div key={index} className="border-t border-slate-200 py-2">
                              <p className="font-black text-slate-900">
                                {hazard.name || hazard.hazard || `Additional Hazard ${index + 1}`}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {hazard.reason || hazard.rationale || "Review recommended."}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {currentStep === 4 && (
          <>
            {(() => {
              const activeRiskScale = getActiveRiskScale();

              return (
                <>
                  <p className="mb-4 text-sm font-semibold leading-6 text-slate-500">
                    Company matrix: <span className="font-black text-slate-700">{activeRiskScale.label}</span>. Select one cell to confirm severity and likelihood.
                  </p>

                  {safeScopeResult?.risk?.operationalRisk && (
                    <div className="mb-4 border-l-4 border-[#1D72B8] bg-[#E8F4FF] px-3 py-2">
                      <p className="text-xs font-black uppercase tracking-wide text-[#1D72B8]">
                        SafeScope Suggested Risk
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        Severity {safeScopeResult.risk.operationalRisk.severity} × Likelihood {safeScopeResult.risk.operationalRisk.likelihood} = {safeScopeResult.risk.operationalRisk.matrixScore} {safeScopeResult.risk.operationalRisk.matrixBand}
                      </p>
                    </div>
                  )}

                  {(() => {
                    const scoreBand = (score: number) => {
                      const max = activeRiskScale.maxScore * activeRiskScale.maxScore;
                      const ratio = score / max;

                      if (ratio >= 0.75) return { label: "Critical", cls: "bg-red-100 text-red-800 border-red-200" };
                      if (ratio >= 0.5) return { label: "High", cls: "bg-orange-100 text-orange-800 border-orange-200" };
                      if (ratio >= 0.25) return { label: "Medium", cls: "bg-amber-100 text-amber-800 border-amber-200" };
                      return { label: "Low", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" };
                    };

                    const likelihoodValues = [...activeRiskScale.likelihood].reverse();
                    const severityValues = activeRiskScale.severity;

                    return (
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h3 className="font-black text-slate-800">Risk Matrix</h3>
                          <p className="text-xs font-bold text-slate-500">
                            Likelihood ↑ / Severity →
                          </p>
                        </div>

                        <div
                          className="grid gap-1"
                          style={{
                            gridTemplateColumns: `44px repeat(${activeRiskScale.maxScore}, minmax(0, 1fr))`,
                          }}
                        >
                          <div />
                          {severityValues.map((s) => (
                            <div key={`s-${s.score}`} className="text-center text-[11px] font-black text-slate-500">
                              S{s.score}
                            </div>
                          ))}

                          {likelihoodValues.map((l) => (
                            <div
                              key={`likelihood-row-${l.score}`}
                              className="contents"
                            >
                              <div key={`l-label-${l.score}`} className="flex items-center justify-center text-[11px] font-black text-slate-500">
                                L{l.score}
                              </div>

                              {severityValues.map((s) => {
                                const score = s.score * l.score;
                                const band = scoreBand(score);
                                const selected = severity === s.score && likelihood === l.score;

                                return (
                                  <button
                                    key={`${s.score}-${l.score}`}
                                    type="button"
                                    onClick={() => {
                                      setSeverity(s.score);
                                      setLikelihood(l.score);
                                    }}
                                    className={`min-h-12 rounded-xl border px-2 py-2 text-center text-xs font-black transition ${band.cls} ${
                                      selected ? "ring-2 ring-[#1D72B8] ring-offset-2" : "hover:scale-[1.02]"
                                    }`}
                                  >
                                    {score}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Selected Severity</p>
                            <p className="mt-1 text-sm font-black text-slate-800">
                              {severity ? `S${severity}` : "Not selected"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Selected Likelihood</p>
                            <p className="mt-1 text-sm font-black text-slate-800">
                              {likelihood ? `L${likelihood}` : "Not selected"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">User-Approved Risk</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {severity && likelihood
                        ? `Severity ${severity} × Likelihood ${likelihood} = ${severity * likelihood}`
                        : "Select a matrix cell to confirm the final risk rating."}
                    </p>
                  </div>
                </>
              );
            })()}
          </>
        )}

        {currentStep === 5 && (
          <>
            <p className="mb-4 text-sm font-semibold leading-6 text-slate-500">
              Select recommended actions when useful, then add the actual action your team will assign and verify.
            </p>

            {safeScopeResult?.generatedActions?.length ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-black text-slate-900">SafeScope Recommended Actions</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                    Select any SafeScope action you want included in the final finding.
                  </p>
                </div>
                {safeScopeResult.generatedActions.map((action: any, index: number) => {
                  const actionKey = action.title || action.description || JSON.stringify(action);
                  const selected = selectedGeneratedActions.some(
                    (selectedAction) =>
                      (selectedAction.title || selectedAction.description || JSON.stringify(selectedAction)) === actionKey
                  );

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleGeneratedAction(action)}
                      className={`w-full border-l-4 border-b border-slate-200 px-3 py-4 text-left transition ${
                        selected
                          ? "border-l-[#1D72B8] bg-[#E8F4FF]"
                          : "border-l-slate-200 bg-transparent hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[#1D72B8] text-xs font-black text-white ${
                            selected ? "bg-[#1D72B8]" : "bg-white"
                          }`}>
                            {selected ? "✓" : ""}
                          </span>

                          <h4 className="font-black text-slate-900">{action.title}</h4>
                        </div>

                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                          {action.priority}
                        </span>
                      </div>

                      <ul className="mt-3 list-disc space-y-1 pl-8 text-sm text-slate-700">
                        {action.suggestedFixes?.map((fix: string, i: number) => (
                          <li key={i}>{fix}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="border-y border-slate-200 py-4 text-sm font-semibold text-slate-600">
                Run SafeScope in Step 3 to generate recommended corrective actions.
              </p>
            )}

            <div className="mt-7 border-t border-slate-200 pt-6">
              <h3 className="font-black text-slate-900">User-Entered Corrective Action</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                Add the actual corrective action your team will assign, track, and verify.
              </p>

              <div className="mt-4 grid gap-3">
                <input
                  value={manualActionTitle}
                  onChange={(event) => setManualActionTitle(event.target.value)}
                  placeholder="Example: Install fixed guard and verify before restart"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={manualActionPriority}
                    onChange={(event) => setManualActionPriority(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>

                  <input
                    type="date"
                    value={manualActionDue}
                    onChange={(event) => setManualActionDue(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
                  />
                </div>

                <button
                  type="button"
                  onClick={addManualAction}
                  className="rounded-xl bg-[#102A43] px-5 py-3 text-sm font-black text-white"
                >
                  Add Corrective Action
                </button>
              </div>

              {!!manualActions.length && (
                <div className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                  {manualActions.map((action, index) => (
                    <div key={`${action.title}-${index}`} className="flex items-start justify-between gap-3 py-3">
                      <div>
                        <p className="font-black text-slate-900">{action.title}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          Priority: {action.priority} • Due: {action.due}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeManualAction(index)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {currentStep === 6 && (
          <>
            <h2 className="mb-4 text-xl font-black text-slate-900">Finalize Inspection</h2>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-black text-slate-900">Inspection Summary</p>
              <p className="mt-2 text-sm text-slate-600">
                Review saved findings and generate the final inspection report.
              </p>
            </div>

            {findingSaveMessage && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-black text-emerald-700">
                {findingSaveMessage}
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-black text-slate-900">Report Customization</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Choose what appears in the final report.
              </p>

              {[
                {
                  label: "Include selected standards",
                  desc: "Show regulatory citations selected by the user.",
                  checked: includeStandardsInReport,
                  toggle: () => setIncludeStandardsInReport(!includeStandardsInReport),
                },
                {
                  label: "Include corrective actions",
                  desc: "Show selected SafeScope actions and user-entered actions.",
                  checked: includeActionsInReport,
                  toggle: () => setIncludeActionsInReport(!includeActionsInReport),
                },
                {
                  label: "Include evidence photos",
                  desc: "Show uploaded/annotated photo evidence in the report.",
                  checked: includePhotosInReport,
                  toggle: () => setIncludePhotosInReport(!includePhotosInReport),
                },
                {
                  label: "Include SafeScope notes",
                  desc: "Show confidence and intelligence notes for internal review.",
                  checked: includeSafeScopeNotesInReport,
                  toggle: () => setIncludeSafeScopeNotesInReport(!includeSafeScopeNotesInReport),
                },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={option.toggle}
                  className="mt-3 flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left"
                >
                  <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 border-[#1D72B8] text-xs font-black text-white ${option.checked ? "bg-[#1D72B8]" : "bg-white"}`}>
                    {option.checked ? "✓" : ""}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-slate-900">{option.label}</span>
                    <span className="block text-xs font-semibold text-slate-500">{option.desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={saveFinding}
                className="rounded-xl bg-[#1D72B8] px-5 py-3 text-sm font-black text-white transition active:scale-[0.98] active:bg-[#155A93]"
              >
                {editingFindingIndex !== null
                  ? "Update Finding"
                  : currentFindingSaved
                    ? "Update Saved Finding"
                    : "Save Current Finding"}
              </button>

              <button
                onClick={addNewFinding}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition active:scale-[0.98] active:bg-slate-300"
              >
                Add New Finding
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-black text-slate-900">
          {currentStep === 6 ? "Saved Findings" : "Current Entry"}
        </h2>

        {currentStep !== 6 ? (
          <>
            <p className="text-sm font-semibold text-slate-600">
              {description || hazardCategory || location
                ? `${hazardCategory || "Uncategorized"} • ${description || "No description yet"}`
                : "Start entering finding details to build the current entry."}
            </p>
            <p className="mt-2 text-xs font-black text-slate-500">
              Photos: {photos.length} • Risk: {safeScopeResult?.risk?.riskBand || riskScore || "Not rated"} • Selected Standards: {selectedStandards.length}
            </p>

            {!!selectedStandards.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedStandards.map((standard: any) => (
                  <span key={standard.citation} className="rounded-full bg-[#E8F4FF] px-3 py-1 text-xs font-black text-[#1D72B8]">
                    {standard.citation}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : findings.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500">No saved findings yet.</p>
        ) : (
          <div className="space-y-3">
            {findings.map((finding, index) => (
              <div key={finding.id || `finding-${index}-${finding.hazardCategory || "unknown"}`} className="rounded-xl border border-slate-200 p-3">
                <div className="font-black">Finding {index + 1}: {finding.hazardCategory || "Uncategorized"}</div>
                <p className="mt-1 text-sm text-slate-600">{finding.description || "No description provided."}</p>
                {!!finding.location && (
                  <p className="mt-1 text-xs font-bold text-slate-500">Location: {finding.location}</p>
                )}
                <p className="mt-1 text-xs font-black text-slate-500">
                  Photos: {finding.photos?.length || 0} • SafeScope: {finding.safeScopeResult?.classification || "Not run"} • Risk: {finding.safeScopeResult?.risk?.riskBand || finding.riskScore || "Not rated"} • Selected Standards: {finding.selectedStandards?.length || 0}
                </p>

                {!!finding.selectedStandards?.length && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {finding.selectedStandards.map((standard: any) => (
                      <span key={standard.citation} className="rounded-full bg-[#E8F4FF] px-3 py-1 text-xs font-black text-[#1D72B8]">
                        {standard.citation}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => editFinding(index)}
                    className="rounded-lg bg-[#E8F4FF] px-3 py-2 text-xs font-black text-[#1D72B8]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFinding(index)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reportValidationMessage && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-black text-red-700">
          {reportValidationMessage}
        </div>
      )}

    </>
  );
}
