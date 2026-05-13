"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { runSafeScopeV2Classify } from "@/lib/safescope";
import AnnotationPreview from "@/components/evidence/AnnotationPreview";
import AnnotationEditor from "@/components/evidence/AnnotationEditor";

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
  const [safeScopeStatus, setSafeScopeStatus] = useState("");
  const [safeScopeResult, setSafeScopeResult] = useState<any>(null);
  const [severity, setSeverity] = useState<number | null>(null);
  const [likelihood, setLikelihood] = useState<number | null>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [editingFindingIndex, setEditingFindingIndex] = useState<number | null>(null);
  const [currentFindingSaved, setCurrentFindingSaved] = useState(false);

  const riskScore = severity && likelihood ? severity * likelihood : null;

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
        evidenceTexts: [
          evidenceNotes,
          location,
          photos.length ? `${photos.length} evidence photo(s) attached` : "",
          ...photos.map((photo, index) => `Photo ${index + 1}: ${photo.name || "evidence photo"}`),
        ].filter(Boolean),
      });

      setSafeScopeResult(result);
      setSafeScopeStatus(`SafeScope v2: ${result.classification} (${result.confidenceBand} confidence)`);
    } catch (error) {
      setSafeScopeStatus(error instanceof Error ? error.message : "SafeScope request failed.");
    }
  }

  function buildCurrentFinding() {
    return {
      id: editingFindingIndex !== null ? findings[editingFindingIndex]?.id : Date.now(),
      hazardCategory,
      description,
      location,
      evidenceNotes,
      safeScopeResult,
      severity,
      likelihood,
      riskScore,
    };
  }

  function hasCurrentFindingData() {
    return !!(description || hazardCategory || location || evidenceNotes || safeScopeResult || severity || likelihood);
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
    setSeverity(null);
    setLikelihood(null);
    setEditingFindingIndex(null);
    setCurrentFindingSaved(false);
  }

  function saveFinding() {
    if (!hasCurrentFindingData()) return;

    const current = buildCurrentFinding();

    if (editingFindingIndex !== null) {
      setFindings((prev) =>
        prev.map((finding, index) =>
          index === editingFindingIndex ? current : finding
        )
      );
    } else if (!currentFindingSaved) {
      setFindings((prev) => [...prev, current]);
    }

    setCurrentFindingSaved(true);
  }

  function addNewFinding() {
    if (!currentFindingSaved && hasCurrentFindingData()) {
      const current = buildCurrentFinding();
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
    setPhotos(finding.photos || []);
    setSafeScopeResult(finding.safeScopeResult || null);
    setSeverity(finding.severity || null);
    setLikelihood(finding.likelihood || null);
    setEditingFindingIndex(index);
    setCurrentFindingSaved(true);
    setCurrentStep(1);
  }

  function deleteFinding(index: number) {
    setFindings((prev) => prev.filter((_, i) => i !== index));
    if (editingFindingIndex === index) {
      resetCurrentFinding();
    }
  }

  function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    const nextPhotos = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...nextPhotos]);
    event.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }


  function generateReport() {
    const finalizedFindings = [...findings];

    if (!currentFindingSaved && hasCurrentFindingData()) {
      finalizedFindings.push(buildCurrentFinding());
    }

    const report = {
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      findings: finalizedFindings,
    };

    window.localStorage.setItem("sentinel_latest_report", JSON.stringify(report));
    router.push("/inspection-review");
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
        <button
          onClick={() => {
            if (currentStep === 1) {
              router.push("/inspection-cover");
              return;
            }
            setCurrentStep((s) => Math.max(1, s - 1));
          }}
          className="text-sm font-black text-[#1D72B8]"
        >
          ← Back
        </button>

        <div className="text-sm font-black text-slate-600">
          Step {currentStep} of {steps.length}
        </div>
      </div>

      <div className="mb-5">
        <h1 className="text-3xl font-black text-slate-900">
          {steps[currentStep - 1].title}
        </h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {steps[currentStep - 1].desc}
        </p>
      </div>

      <div className="mb-5 flex gap-2">
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const active = currentStep === stepNumber;
          const complete = currentStep > stepNumber;

          return (
            <div key={stepNumber} className="h-2 flex-1 rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full ${
                  active || complete ? "bg-[#1D72B8]" : "bg-slate-200"
                }`}
              />
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {currentStep === 1 && (
          <>
            <h2 className="mb-4 text-xl font-black text-slate-900">Hazard Identification</h2>

            <label className="mb-2 block text-sm font-black text-slate-700">Hazard Category</label>
            <input
              className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-[#1D72B8]"
              placeholder="Example: Electrical, fall protection, guarding"
              value={hazardCategory}
              onChange={(e) => setHazardCategory(e.target.value)}
            />

            <label className="mb-2 block text-sm font-black text-slate-700">Description</label>
            <textarea
              className="mb-4 min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-[#1D72B8]"
              placeholder="Describe the hazard, where it was found, who may be exposed, and what condition exists."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="mb-2 block text-sm font-black text-slate-700">Location</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-[#1D72B8]"
              placeholder="Example: Conveyor 3, north catwalk"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="mb-4 text-xl font-black text-slate-900">Evidence Capture</h2>

            <div className="mb-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="text-4xl">📷</div>
              <div className="mt-2 text-lg font-black text-slate-900">Evidence Photos</div>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Take photos in the field or upload existing evidence images.
              </p>

              <div className="mt-5 flex justify-center gap-3">
                <label className="cursor-pointer rounded-xl bg-[#1D72B8] px-4 py-3 text-sm font-black text-white">
                  Take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>

                <label className="cursor-pointer rounded-xl bg-slate-200 px-4 py-3 text-sm font-black text-slate-700">
                  Upload Photo
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
              <div className="mb-4 grid gap-3 md:grid-cols-3">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <AnnotationPreview photoUrl={photo.url} annotations={photo.annotations || []} />

                    <div className="space-y-2 p-3">
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

            <label className="mb-2 block text-sm font-black text-slate-700">Evidence Notes</label>
            <textarea
              className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-[#1D72B8]"
              placeholder="Describe photos, documents, or evidence needed."
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2 className="mb-4 text-xl font-black text-slate-900">SafeScope Regulation Mapping</h2>

            <div className="mb-4 rounded-xl bg-[#E8F4FF] p-4 text-sm font-semibold text-slate-700">
              SafeScope uses the hazard category, description, location, evidence notes, and selected agency mode to suggest likely standards. Suggestions must be reviewed by a qualified safety professional.
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
                      ? "bg-[#1D72B8] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunSafeScope}
              className="mb-3 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-black text-white"
            >
              Run SafeScope Match
            </button>

            {safeScopeStatus && <p className="mb-4 text-sm font-black text-slate-600">{safeScopeStatus}</p>}

            {safeScopeResult?.risk && (
              <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                <h3 className="mb-3 text-lg font-black text-slate-900">SafeScope Risk Intelligence</h3>

                <div className="mb-3 rounded-xl bg-white p-3">
                  <div className="text-sm font-black text-slate-900">Operational Matrix</div>
                  <p className="mt-1 text-sm text-slate-600">
                    Severity {safeScopeResult.risk.operationalRisk?.severity} × Likelihood {safeScopeResult.risk.operationalRisk?.likelihood}
                  </p>
                  <p className="text-sm text-slate-600">
                    Score: {safeScopeResult.risk.operationalRisk?.matrixScore} • {safeScopeResult.risk.operationalRisk?.matrixBand}
                  </p>
                </div>

                <div className="mb-3 rounded-xl bg-white p-3">
                  <div className="text-sm font-black text-slate-900">AI Escalation</div>
                  <p className="mt-1 text-sm text-slate-600">
                    Score: {safeScopeResult.risk.aiRisk?.escalationScore ?? safeScopeResult.risk.riskScore} • {safeScopeResult.risk.aiRisk?.escalationBand ?? safeScopeResult.risk.riskBand}
                  </p>
                  <p className="text-sm text-slate-600">
                    Fatality Potential: {safeScopeResult.risk.aiRisk?.fatalityPotential ?? safeScopeResult.risk.fatalityPotential}
                  </p>
                </div>

                {safeScopeResult.risk.requiresShutdown && (
                  <p className="rounded-xl bg-red-100 p-3 text-sm font-black text-red-700">
                    Shutdown / immediate control recommended.
                  </p>
                )}
              </div>
            )}

            {safeScopeResult?.suggestedStandards?.map((standard: any) => (
              <div key={standard.citation} className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="font-black text-[#1D72B8]">{standard.citation}</div>
                <p className="mt-1 text-sm text-slate-600">{standard.rationale}</p>
              </div>
            ))}
          </>
        )}

        {currentStep === 4 && (
          <>
            <h2 className="mb-2 text-xl font-black text-slate-900">Risk Assessment</h2>
            <p className="mb-4 text-sm font-semibold text-slate-500">
              Select 1–5 for severity and likelihood. Higher numbers mean greater risk.
            </p>

            <h3 className="mb-2 font-black text-slate-800">Severity: How bad could the outcome be?</h3>
            {severityScale.map((item) => (
              <button
                key={item.score}
                onClick={() => setSeverity(item.score)}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                  severity === item.score
                    ? "border-[#1D72B8] bg-[#E8F4FF]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-black">
                  {item.score}
                </span>
                <span>
                  <span className="block font-black">{item.label}</span>
                  <span className="text-sm text-slate-500">{item.desc}</span>
                </span>
              </button>
            ))}

            <h3 className="mb-2 mt-5 font-black text-slate-800">Likelihood: How likely is it to happen?</h3>
            {likelihoodScale.map((item) => (
              <button
                key={item.score}
                onClick={() => setLikelihood(item.score)}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                  likelihood === item.score
                    ? "border-[#1D72B8] bg-[#E8F4FF]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-black">
                  {item.score}
                </span>
                <span>
                  <span className="block font-black">{item.label}</span>
                  <span className="text-sm text-slate-500">{item.desc}</span>
                </span>
              </button>
            ))}

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-black text-slate-500">Calculated Risk Score</div>
              <div className="mt-1 text-3xl font-black text-slate-900">
                {riskScore ? `${riskScore} / 25` : "Select severity and likelihood"}
              </div>
            </div>
          </>
        )}

        {currentStep === 5 && (
          <>
            <h2 className="mb-4 text-xl font-black text-slate-900">Corrective Actions</h2>

            {safeScopeResult?.generatedActions?.length ? (
              <div className="space-y-3">
                <h3 className="font-black text-slate-900">SafeScope Recommended Actions</h3>
                {safeScopeResult.generatedActions.map((action: any, index: number) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-black text-slate-900">{action.title}</h4>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                        {action.priority}
                      </span>
                    </div>

                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {action.suggestedFixes?.map((fix: string, i: number) => (
                        <li key={i}>{fix}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                Run SafeScope in Step 3 to generate recommended corrective actions.
              </div>
            )}
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

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={saveFinding}
                className="rounded-xl bg-[#1D72B8] px-5 py-3 text-sm font-black text-white"
              >
                {editingFindingIndex !== null ? "Update Finding" : "Save Current Finding"}
              </button>

              <button
                onClick={addNewFinding}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-black text-slate-700"
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
              Photos: {photos.length} • Risk: {safeScopeResult?.risk?.riskBand || riskScore || "Not rated"} • Standards: {safeScopeResult?.suggestedStandards?.length || 0}
            </p>
          </>
        ) : findings.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500">No saved findings yet.</p>
        ) : (
          <div className="space-y-3">
            {findings.map((finding, index) => (
              <div key={finding.id} className="rounded-xl border border-slate-200 p-3">
                <div className="font-black">Finding {index + 1}: {finding.hazardCategory || "Uncategorized"}</div>
                <p className="mt-1 text-sm text-slate-600">{finding.description || "No description provided."}</p>
                {!!finding.location && (
                  <p className="mt-1 text-xs font-bold text-slate-500">Location: {finding.location}</p>
                )}
                <p className="mt-1 text-xs font-black text-slate-500">
                  Photos: {finding.photos?.length || 0} • SafeScope: {finding.safeScopeResult?.classification || "Not run"} • Risk: {finding.safeScopeResult?.risk?.riskBand || finding.riskScore || "Not rated"}
                </p>

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

      <div className="mt-5 flex justify-between">
        <button
          onClick={() => {
            if (currentStep === 1) {
              router.push("/inspection-cover");
              return;
            }
            setCurrentStep((s) => Math.max(1, s - 1));
          }}
          className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (currentStep === 6) {
              generateReport();
              return;
            }
            setCurrentStep((s) => Math.min(6, s + 1));
          }}
          className="rounded-xl bg-[#102A43] px-5 py-3 text-sm font-black text-white"
        >
          {currentStep === 6 ? "Generate Report" : "Next"}
        </button>
      </div>
    </>
  );
}
