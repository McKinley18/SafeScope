"use client";

import { useState } from "react";
import { runSafeScopeV2Classify } from "@/lib/safescope";

const steps = [
  "Identify Hazards",
  "Evidence",
  "Regulation",
  "Risk Assessment",
  "Corrective Actions",
  "Finalize",
];

export default function InspectionPage() {
  const [step, setStep] = useState(1);
  const [hazardCategory, setHazardCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [agencyMode, setAgencyMode] = useState("all");
  const [severity, setSeverity] = useState<number | null>(null);
  const [likelihood, setLikelihood] = useState<number | null>(null);
  const [safeScopeStatus, setSafeScopeStatus] = useState("");
  const [safeScopeResult, setSafeScopeResult] = useState<any>(null);

  const riskScore = severity && likelihood ? severity * likelihood : null;

  async function runSafeScope() {
    setSafeScopeStatus("Running SafeScope...");
    setSafeScopeResult(null);

    try {
      const result = await runSafeScopeV2Classify({
        text: [
          `Hazard category: ${hazardCategory || "Unspecified"}`,
          `Observed condition: ${description || "No description provided"}`,
          `Location: ${location || "No location provided"}`,
          `Evidence notes: ${evidenceNotes || "No evidence notes provided"}`,
          `Regulatory scope: ${agencyMode.toUpperCase()}`,
        ].join("\n"),
        scopes: agencyMode === "all" ? undefined : [agencyMode],
        evidenceTexts: [evidenceNotes, location].filter(Boolean),
      });

      setSafeScopeResult(result);
      setSafeScopeStatus(`SafeScope: ${result.classification} (${result.confidenceBand})`);
    } catch (error) {
      setSafeScopeStatus(error instanceof Error ? error.message : "SafeScope failed.");
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Inspection Walkthrough</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Build a defensible finding with evidence, standards, risk, and corrective actions.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-6">
        {steps.map((label, index) => {
          const number = index + 1;
          return (
            <button
              key={label}
              onClick={() => setStep(number)}
              className={`rounded-xl border px-3 py-3 text-left text-xs font-black ${
                step === number
                  ? "border-[#1D72B8] bg-[#E8F4FF] text-[#1D72B8]"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              Step {number}
              <div className="mt-1 text-[11px]">{label}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Step 1: Identify Hazards</h2>

            <label className="block text-sm font-black">Hazard Category</label>
            <input
              className="w-full rounded-xl border border-slate-300 p-3"
              placeholder="Example: Electrical, Fall, Machine, Housekeeping"
              value={hazardCategory}
              onChange={(e) => setHazardCategory(e.target.value)}
            />

            <label className="block text-sm font-black">Observed Condition</label>
            <textarea
              className="w-full rounded-xl border border-slate-300 p-3"
              rows={5}
              placeholder="Example: live wire hanging near walkway"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="block text-sm font-black">Location</label>
            <input
              className="w-full rounded-xl border border-slate-300 p-3"
              placeholder="Example: Conveyor 3, north catwalk"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Step 2: Evidence</h2>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="text-4xl">📷</div>
              <p className="mt-2 font-black">Evidence Photos</p>
              <p className="text-sm text-slate-500">Photo upload and annotation will be restored next.</p>
            </div>

            <label className="block text-sm font-black">Evidence Notes</label>
            <textarea
              className="w-full rounded-xl border border-slate-300 p-3"
              rows={4}
              placeholder="Describe photos, exposure, workers nearby, equipment state, or missing controls."
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Step 3: SafeScope Regulation Mapping</h2>

            <div className="rounded-xl bg-blue-50 p-4 text-sm font-semibold text-slate-700">
              SafeScope uses the hazard description, location, evidence notes, and selected regulatory scope to suggest standards.
            </div>

            <div className="flex flex-wrap gap-2">
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
              onClick={runSafeScope}
              className="rounded-xl bg-[#1D72B8] px-5 py-3 font-black text-white"
            >
              Run SafeScope Match
            </button>

            {safeScopeStatus && <p className="font-bold text-slate-700">{safeScopeStatus}</p>}

            {safeScopeResult && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-lg font-black">SafeScope Result</h3>
                <p><strong>Classification:</strong> {safeScopeResult.classification}</p>
                <p><strong>Confidence:</strong> {Math.round((safeScopeResult.confidence || 0) * 100)}%</p>
                <p><strong>Risk:</strong> {safeScopeResult.risk?.riskBand} ({safeScopeResult.risk?.riskScore})</p>

                {safeScopeResult.risk?.requiresShutdown && (
                  <div className="rounded-xl bg-red-100 p-3 font-black text-red-800">
                    Shutdown / immediate control recommended.
                  </div>
                )}

                <div>
                  <h4 className="font-black">Suggested Standards</h4>
                  <div className="mt-2 space-y-2">
                    {safeScopeResult.suggestedStandards?.map((standard: any) => (
                      <div key={standard.citation} className="rounded-xl bg-white p-3">
                        <strong>{standard.citation}</strong>: {standard.rationale}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-black">Step 4: Risk Assessment</h2>

            <div>
              <p className="mb-2 font-black">Severity</p>
              <div className="grid gap-2 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSeverity(n)}
                    className={`rounded-xl border p-4 font-black ${
                      severity === n ? "border-[#1D72B8] bg-[#E8F4FF]" : "border-slate-200 bg-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-black">Likelihood</p>
              <div className="grid gap-2 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setLikelihood(n)}
                    className={`rounded-xl border p-4 font-black ${
                      likelihood === n ? "border-[#1D72B8] bg-[#E8F4FF]" : "border-slate-200 bg-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-black text-slate-500">Calculated Risk Score</p>
              <p className="mt-1 text-3xl font-black">{riskScore ? `${riskScore} / 25` : "Select severity and likelihood"}</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Step 5: Corrective Actions</h2>

            {safeScopeResult?.generatedActions?.length ? (
              <div className="space-y-3">
                {safeScopeResult.generatedActions.map((action: any, index: number) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-black">{action.title}</h3>
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
                Run SafeScope in Step 3 to generate situation-specific corrective actions.
              </div>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Step 6: Finalize</h2>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-black">Inspection Report Preview</p>
              <p className="mt-2 text-sm text-slate-600">
                This will compile hazard details, evidence, standards, risk, and corrective actions into a final report.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className="rounded-xl bg-white px-5 py-3 font-black text-slate-700 shadow-sm"
        >
          Back
        </button>

        <button
          onClick={() => setStep(Math.min(6, step + 1))}
          className="rounded-xl bg-[#102A43] px-5 py-3 font-black text-white"
        >
          {step === 6 ? "Generate Report" : "Next"}
        </button>
      </div>
    </section>
  );
}
