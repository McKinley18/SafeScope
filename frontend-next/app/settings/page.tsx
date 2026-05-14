"use client";

import { useEffect, useState } from "react";
import {
  getOrganizationInvites,
  getOrganizationMembers,
  getOrganizationSettings,
  inviteOrganizationMember,
  updateOrganizationSettings,
} from "@/lib/auth";

type RiskProfileId = "simple_4x4" | "standard_5x5" | "advanced_6x6";
type StorageMode = "local" | "cloud" | "ask";

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
  const [companyLogo, setCompanyLogo] = useState("");
  const [includeLogoOnCover, setIncludeLogoOnCover] = useState(true);
  const [storageMode, setStorageMode] = useState<StorageMode>("local");
  const [riskProfileId, setRiskProfileId] = useState<RiskProfileId>("standard_5x5");
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Auditor");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    async function loadSettings() {
      try {
        setStatus("Loading settings...");
        const settings = await getOrganizationSettings();

        setOrganizationName(settings.name || "");
        setCompanyLogo(settings.logoPath || window.localStorage.getItem("sentinel_company_logo") || "");
        setIncludeLogoOnCover(window.localStorage.getItem("sentinel_include_logo_on_cover") !== "false");
        setStorageMode(
          (window.localStorage.getItem("sentinel_report_storage_mode") as StorageMode | null)
          || "local"
        );
        setRiskProfileId((settings.riskProfileId || "standard_5x5") as RiskProfileId);
        window.localStorage.setItem(
          "sentinel_company_risk_profile",
          settings.riskProfileId || "standard_5x5"
        );

        const [loadedMembers, loadedInvites] = await Promise.all([
          getOrganizationMembers(),
          getOrganizationInvites(),
        ]);

        setMembers(loadedMembers);
        setInvites(loadedInvites);

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


  function handleLogoUpload(file?: File) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCompanyLogo(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  }

  async function saveSettings() {
    try {
      setStatusType("idle");
      setStatus("Saving settings...");

      const saved = await updateOrganizationSettings({
        name: organizationName,
        riskProfileId,
        logoPath: companyLogo,
      });

      window.localStorage.setItem(
        "sentinel_company_risk_profile",
        saved.riskProfileId || riskProfileId
      );
      window.localStorage.setItem("sentinel_company_logo", saved.logoPath || companyLogo || "");
      window.localStorage.setItem("sentinel_include_logo_on_cover", String(includeLogoOnCover));
      window.localStorage.setItem("sentinel_report_storage_mode", storageMode);

      setStatusType("success");
      setStatus("Settings saved. New SafeScope runs will use this company risk matrix.");
    } catch {
      setStatusType("error");
      setStatus("Settings could not be saved. Please make sure you are signed in.");
    }
  }

  async function sendInvite() {
    try {
      if (!inviteEmail.trim()) {
        setStatusType("error");
        setStatus("Enter an email address before sending an invite.");
        return;
      }

      setStatusType("idle");
      setStatus("Creating invitation...");

      const invite = await inviteOrganizationMember({
        email: inviteEmail.trim(),
        role: inviteRole,
      });

      setInvites((current) => [invite, ...current]);
      setInviteEmail("");
      setStatusType("success");
      setStatus(`Invitation created for ${invite.email}.`);
    } catch {
      setStatusType("error");
      setStatus("Invitation could not be created. Please make sure you are signed in.");
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

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-black text-slate-900">Company Logo</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Upload a logo to include on inspection report cover pages.
          </p>

          {companyLogo && (
            <div className="mt-4 rounded-xl bg-white p-4">
              <img src={companyLogo} alt="Company logo preview" className="max-h-24 max-w-full object-contain" />
            </div>
          )}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => handleLogoUpload(event.target.files?.[0])}
            className="mt-4 block w-full text-sm font-bold text-slate-700"
          />

          <button
            type="button"
            onClick={() => setIncludeLogoOnCover(!includeLogoOnCover)}
            className="mt-4 flex w-full gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left"
          >
            <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 border-[#1D72B8] text-xs font-black text-white ${includeLogoOnCover ? "bg-[#1D72B8]" : "bg-white"}`}>
              {includeLogoOnCover ? "✓" : ""}
            </span>
            <span>
              <span className="block text-sm font-black text-slate-900">Include logo on report cover page</span>
              <span className="block text-xs font-semibold text-slate-500">Users can still prepare reports without displaying the logo.</span>
            </span>
          </button>
        </div>
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
        <h2 className="text-xl font-black text-slate-900">Team Members</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Manage who can access this Sentinel Safety workspace.
        </p>

        <div className="mt-4 space-y-3">
          {members.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-500">
              No members loaded.
            </p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-black text-slate-900">{member.name}</p>
                <p className="text-sm font-semibold text-slate-500">{member.email}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#1D72B8]">
                  {member.role}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Invite Teammate</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Create an invitation token for another user to join this workspace.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="teammate@example.com"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
          />

          <select
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
          >
            <option value="Auditor">Auditor</option>
            <option value="Viewer">Viewer</option>
            <option value="Owner">Owner</option>
          </select>

          <button
            type="button"
            onClick={sendInvite}
            className="rounded-xl bg-[#102A43] px-5 py-3 text-sm font-black text-white"
          >
            Send Invite
          </button>
        </div>

        {!!invites.length && (
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-black text-slate-900">Pending Invites</h3>
            <div className="space-y-2">
              {invites.map((invite) => (
                <div key={invite.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-black text-slate-900">{invite.email}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    Role: {invite.role} • Used: {invite.isUsed ? "Yes" : "No"}
                  </p>
                  <p className="mt-1 break-all text-xs font-bold text-[#1D72B8]">
                    Invite token: {invite.token}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Data & Privacy</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Control where Sentinel Safety inspection reports are stored.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              id: "local",
              label: "Local Only",
              description: "Reports stay in this browser/device only."
            },
            {
              id: "cloud",
              label: "Workspace Database",
              description: "Reports save to the Sentinel Safety workspace database."
            },
            {
              id: "ask",
              label: "Ask Each Time",
              description: "Choose local or cloud storage when finalizing reports."
            }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setStorageMode(mode.id as StorageMode)}
              className={`rounded-2xl border p-4 text-left ${
                storageMode === mode.id
                  ? "border-[#1D72B8] bg-[#E8F4FF]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="font-black text-slate-900">{mode.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {mode.description}
              </p>
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
