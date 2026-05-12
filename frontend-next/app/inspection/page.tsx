"use client";

import { useState } from "react";
import { runSafeScopeV2Classify } from "@/lib/safescope";

export default function InspectionPage() {
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [evidence, setEvidence] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);

  async function runSafeScope() {
    setStatus("Running SafeScope...");
    setResult(null);

    try {
      const data = await runSafeScopeV2Classify({
        text: `Observed condition: ${condition}\nLocation: ${location}\nEvidence notes: ${evidence}`,
        evidenceTexts: [location, evidence].filter(Boolean),
      });

      setResult(data);
      setStatus("SafeScope complete.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "SafeScope failed.");
    }
  }

  return (
    <section className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-black">Inspection Walkthrough</h1>
      <p className="mt-2 text-slate-600">
        Capture the hazard, add context, and run SafeScope intelligence.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <label className="font-bold">Observed Condition</label>
        <textarea
          className="mt-2 w-full rounded-xl border p-3"
          rows={4}
          placeholder="Example: live wire hanging near walkway"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />

        <label className="mt-4 block font-bold">Location</label>
        <input
          className="mt-2 w-full rounded-xl border p-3"
          placeholder="Example: North walkway near conveyor 2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label className="mt-4 block font-bold">Evidence Notes</label>
        <textarea
          className="mt-2 w-full rounded-xl border p-3"
          rows={3}
          placeholder="Example: pedestrians pass through area; conductor appears exposed"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
        />

        <button
          onClick={runSafeScope}
          className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-black text-white"
        >
          Run SafeScope
        </button>

        {status && <p className="mt-4 font-semibold text-slate-700">{status}</p>}
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-2xl font-black">SafeScope Result</h2>
          <p className="mt-3"><strong>Classification:</strong> {result.classification}</p>
          <p><strong>Confidence:</strong> {Math.round((result.confidence || 0) * 100)}%</p>
          <p><strong>Risk:</strong> {result.risk?.riskBand} ({result.risk?.riskScore})</p>

          {result.risk?.requiresShutdown && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-800">
              Shutdown / immediate control recommended.
            </div>
          )}

          <h3 className="mt-5 font-black">Recommended Corrective Actions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {result.generatedActions?.flatMap((a: any) => a.suggestedFixes || []).map((fix: string, index: number) => (
              <li key={index}>{fix}</li>
            ))}
          </ul>

          <h3 className="mt-5 font-black">Suggested Standards</h3>
          <ul className="mt-2 space-y-2">
            {result.suggestedStandards?.map((standard: any) => (
              <li key={standard.citation} className="rounded-xl bg-slate-50 p-3">
                <strong>{standard.citation}</strong> — {standard.rationale}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
