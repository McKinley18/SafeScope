"use client";

import { useEffect, useState } from "react";

type RiskProfileId = "simple_4x4" | "standard_5x5" | "advanced_6x6";

const riskProfiles: Array<{
  id: RiskProfileId;
  label: string;
  description: string;
}> = [
  {
    id: "simple_4x4",
    label: "Simple 4x4",
    description: "Simpler matrix for smaller teams or lower-complexity programs.",
  },
  {
    id: "standard_5x5",
    label: "Standard 5x5",
    description: "Recommended default for most safety programs.",
  },
  {
    id: "advanced_6x6",
    label: "Advanced 6x6",
    description: "More granular scoring for mature or enterprise programs.",
  },
];

export default function SettingsPage() {
  const [riskProfileId, setRiskProfileId] = useState<RiskProfileId>("standard_5x5");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("sentinel_company_risk_profile") as RiskProfileId | null;
    if (saved) setRiskProfileId(saved);
  }, []);

  function saveSettings() {
    window.localStorage.setItem("sentinel_company_risk_profile", riskProfileId);
    setStatus("Settings saved. New SafeScope runs will use this company risk matrix.");
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-[#1D72B8]">
          Workspace
        </p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Settings</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Configure workspace preferences, report defaults, and safety review behavior.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Company Risk Matrix</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          This controls the default SafeScope risk matrix for all new inspections in this workspace.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {riskProfiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setRiskProfileId(profile.id)}
              className={`rounded-2xl border p-4 text-left ${
                riskProfileId === profile.id
                  ? "border-[#1D72B8] bg-[#E8F4FF]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="font-black text-slate-900">{profile.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">{profile.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <label className="flex items-start gap-3">
            <input type="checkbox" defaultChecked className="mt-1" />
            <div>
              <p className="font-black text-slate-900">Require human review before finalizing reports</p>
              <p className="text-sm font-semibold text-slate-500">
                Keeps SafeScope outputs advisory until reviewed by a qualified safety professional.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3">
            <input type="checkbox" defaultChecked className="mt-1" />
            <div>
              <p className="font-black text-slate-900">Show privileged and confidential option</p>
              <p className="text-sm font-semibold text-slate-500">
                Allows confidential markings on generated inspection reports.
              </p>
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          className="mt-5 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-black text-white"
        >
          Save Settings
        </button>

        {status && (
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
