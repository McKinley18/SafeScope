"use client";

import Link from "next/link";
import { clearActiveInspectionDraft } from "@/lib/inspectionDraft";
import PageHeader from "@/components/ui/PageHeader";

export default function InspectionsPage() {
  return (
    <section className="space-y-7">
      <PageHeader
        title="Inspections"
        description="Start a new inspection or continue one that was saved before finalizing."
      />

      <section className="grid gap-5 rounded-[24px] bg-[#0B1320] px-5 py-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
        <div className="text-center md:text-left">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[1px] text-[#F97316]">
            Guided Workflow
          </p>
          <h2 className="text-2xl font-black text-white">Build Inspection</h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
            Follow a simple guided workflow: cover page, hazard details, photos,
            SafeScope standards, risk review, corrective actions, and final report generation.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <Link
            href="/inspection-cover" onClick={() => clearActiveInspectionDraft()}
            className="min-w-[180px] rounded-xl border border-white/10 bg-[#1A2436] px-6 py-3 text-center text-sm font-black text-white"
          >
            Start Inspection
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-6">
        <h2 className="text-xl font-black text-slate-900">Unfinished Inspections</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          Saved drafts will appear here when an inspection is started but not finalized.
        </p>

        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/60 p-5 text-center">
          <p className="text-sm font-bold text-slate-500">
            No unfinished inspections yet.
          </p>
        </div>
      </section>
    </section>
  );
}
