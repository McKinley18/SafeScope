"use client";

import Link from "next/link";
import { clearActiveInspectionDraft } from "@/lib/inspectionDraft";
import StatusBadge from "@/components/ui/StatusBadge";

const priorityWork = [
  ["Electrical exposure near conveyor", "Critical", "Conveyor Line 2", "Verify isolation and corrective action before restart."],
  ["Missing guard on rotating shaft", "High", "Packaging Area", "Install guard and document supervisor verification."],
  ["Blocked emergency exit", "High", "Warehouse North", "Clear access path and confirm emergency route availability."],
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <section className="rounded-[32px] bg-[#0B1320] px-6 py-7 text-white shadow-xl shadow-slate-300/40 sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
          Sentinel Command Center
        </p>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              Operational risk intelligence.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
              Monitor inspections, corrective actions, critical exposures, and SafeScope trends without crowding the workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/inspection-cover"
              onClick={() => clearActiveInspectionDraft()}
              className="rounded-2xl bg-[#1D72B8] px-5 py-3 text-sm font-black text-white transition hover:bg-[#155A93]"
            >
              Start Inspection
            </Link>
            <Link
              href="/reports"
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
            >
              Reports
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-7">
        {[
          ["12", "Open Findings", "bg-blue-50 text-blue-700 border-blue-100"],
          ["3", "Critical", "bg-red-50 text-red-700 border-red-100"],
          ["5", "Overdue", "bg-orange-50 text-orange-700 border-orange-100"],
          ["91%", "SafeScope Confidence", "bg-emerald-50 text-emerald-700 border-emerald-100"],
        ].map(([value, label, tone]) => (
          <div
            key={label}
            className={`rounded-2xl border px-4 py-5 text-center ${tone}`}
          >
            <p className="text-4xl font-black tracking-tight">{value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-wide opacity-75">
              {label}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
                Priority Work
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Needs attention
              </h2>
            </div>
            <Link href="/actions" className="text-sm font-black text-[#1D72B8]">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {priorityWork.map(([title, priority, location, note]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span
                      className={`mt-1 h-10 w-1.5 rounded-full ${
                        priority === "Critical" ? "bg-red-500" : "bg-orange-400"
                      }`}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={priority === "Critical" ? "critical" : "high"}>
                          {priority}
                        </StatusBadge>
                        <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                          {location}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-black text-slate-900">{title}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{note}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-[#E8F4FF] shadow-sm">
          <div className="bg-gradient-to-br from-[#0B1320] to-[#102A43] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-200">
              SafeScope Intelligence
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Recurring guarding and energy-control exposure detected.
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
              SafeScope recommends prioritizing machine guarding, lockout verification, and supervisor sign-off for elevated-risk equipment.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 p-4">
            {["Guarding", "LOTO", "Verify"].map((item) => (
              <div key={item} className="rounded-xl bg-white px-3 py-3 text-center shadow-sm">
                <p className="text-xs font-black text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
