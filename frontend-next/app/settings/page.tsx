"use client";

import { useEffect, useState } from "react";
import {
  getOrganizationSettings,
  updateOrganizationSettings,
} from "@/lib/auth";

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
  const [organizationName, setOrganizationName] = useState("");
  const [riskProfileId, setRiskProfileId] = useState<RiskProfileId>("standard_5x5");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    async function loadSettings() {
      try {
        setStatus("Loading settings...");
        const settings = await getOrganizationSettings();

        setOrganizationName(settings.name || "");
        setRiskProfileId((settings.riskProfileId || "standard_5x5") as RiskProfileId);
        window.localStorage.setItem(
          "sentinel_company_risk_profile",
          settings.riskProfileId || "standard_5x5"
        );

        setStatus("");
        setStatusType("idle");
      } catch {
        const saved = window.localStorage.getItem("sentinel_company_risk_profile") as RiskProfileId | null;
        if (saved) setRiskProfileId(saved);

        setStatusType("error");
        setStatus("Unable to load workspace settings. Please sign in again.");
      }
    }

    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      setStatusType("idle");
      setStatus("Saving settings...");

      const saved = await updateOrganizationSettings({
        name: organizationName,
        riskProfileId,
      });

      window.localStorage.setItem(
        "sentinel_company_risk_profile",
        saved.riskProfileId || riskProfileId
      );

      setStatusType("success");
      setStatus("Settings saved. New SafeScope runs will use this company risk matrix.");
    } catch {
      setStatusType("error");
      setStatus("Settings could not be saved. Please make sure you are signed in.");
    }
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
        <h2 className="text-xl font-black text-slate-900">Workspace Profile</h2>
        <label className="mt-4 block text-sm font-black text-slate-700">
          Organization Name
        </label>
        <input
          value={organizationName}
          onChange={(event) => setOrganizationName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
        />
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
          <p
            className={`mt-3 rounded-xl p-3 text-sm font-bold ${
              statusType === "error"
                ? "bg-red-50 text-red-700"
                : statusType === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-50 text-slate-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
