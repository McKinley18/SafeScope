"use client";

export default function SettingsPage() {
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

        <button className="mt-5 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-black text-white">
          Save Settings
        </button>
      </div>
    </section>
  );
}
