"use client";

import Link from "next/link";
import { clearActiveInspectionDraft } from "@/lib/inspectionDraft";
import PageHeader from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <section className="space-y-7">
      <PageHeader
        title="Dashboard"
        description="A simple overview of inspections, reports, risks, and corrective work."
      />

      <section className="rounded-[24px] bg-[#0B1320] px-4 py-5 shadow-sm">
        <h2 className="text-center text-xl font-black text-[#F97316]">
          Quick Links
        </h2>

        <div className="mx-auto mt-4 grid max-w-xs grid-cols-2 gap-2">
          <Link href="/inspection-cover" onClick={() => clearActiveInspectionDraft()} className="col-span-2 rounded-xl border border-white/10 bg-[#1A2436] px-4 py-3 text-center text-sm font-black text-white">
            Start Inspection
          </Link>
          <Link href="/reports" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs font-black text-slate-200">
            Reports
          </Link>
          <Link href="/actions" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs font-black text-slate-200">
            Actions
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-300 pt-6">
        <h2 className="mb-4 text-xl font-black text-slate-900">Today’s Status</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            ["12", "Open"],
            ["3", "Critical"],
            ["5", "Overdue"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl bg-white px-2 py-2 text-center">
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs font-black text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-300 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Priority Work</h2>
          <Link href="/actions" className="text-sm font-black text-[#1D72B8]">
            View All
          </Link>
        </div>

        <div className="divide-y divide-slate-200">
          {[
            ["Electrical exposure near conveyor", "Critical"],
            ["Missing guard on rotating shaft", "High"],
            ["Blocked emergency exit", "High"],
          ].map(([title, priority]) => (
            <div key={title} className="flex items-center justify-between gap-3 py-3">
              <p className="text-sm font-bold leading-5 text-slate-800">{title}</p>
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {priority}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-300 pt-6">
        <h2 className="text-xl font-black text-slate-900">SafeScope Note</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Recurring guarding and energy-control exposure detected. Focus corrective actions on verification before restart.
        </p>
      </section>
    </section>
  );
}
