import Link from "next/link";

export default function InspectionsPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Inspections</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Launch the guided inspection builder to document findings, add evidence, classify hazards with SafeScope, and prepare corrective actions.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Guided Inspection Builder</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Build a professional safety inspection report using hazard identification, evidence capture, standards mapping, risk scoring, and corrective action planning.
        </p>

        <Link
          href="/inspection-cover"
          className="mt-5 inline-block rounded-xl bg-[#102A43] px-5 py-3 text-sm font-black text-white"
        >
          Start Inspection
        </Link>
      </div>
    </section>
  );
}
