import Link from "next/link";
import { ShieldCheck, AlertTriangle, ClipboardCheck, Activity } from "lucide-react";

const stats = [
  { label: "Open Findings", value: "0", icon: AlertTriangle },
  { label: "Corrective Actions", value: "0", icon: ClipboardCheck },
  { label: "Critical Risks", value: "0", icon: Activity },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Sentinel Safety Command Center
            </p>
            <h1 className="mt-4 text-4xl font-black text-white">
              See Risk. Prevent Harm.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Run inspections, classify hazards with SafeScope, generate corrective actions,
              and build defensible safety reports from one clean workspace.
            </p>
          </div>

          <div className="hidden rounded-2xl bg-blue-600 p-5 shadow-xl md:block">
            <ShieldCheck size={42} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/inspection"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
          >
            Start Inspection
          </Link>
          <Link
            href="/reports"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-black text-slate-200 hover:bg-slate-800"
          >
            View Reports
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-400">{item.label}</p>
                <Icon className="text-blue-400" size={20} />
              </div>
              <p className="mt-4 text-4xl font-black text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-black text-white">SafeScope Intelligence</h2>
          <p className="mt-3 text-slate-400">
            The clean frontend is now ready to reconnect the classification, standards,
            risk, evidence fusion, and corrective action engines.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-black text-white">Next Build Target</h2>
          <p className="mt-3 text-slate-400">
            Rebuild the inspection workflow into a polished step-by-step experience without
            bringing back the broken mixed Expo/Next structure.
          </p>
        </div>
      </div>
    </section>
  );
}
