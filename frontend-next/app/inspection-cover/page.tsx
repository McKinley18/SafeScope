import Link from "next/link";

export default function InspectionCoverPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Inspection Builder</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Prepare a structured inspection report with evidence, SafeScope intelligence, risk scoring, and corrective actions.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="rounded-2xl bg-[#E8F4FF] p-5">
          <p className="text-sm font-black uppercase tracking-wide text-[#1D72B8]">
            Sentinel Safety Workflow
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Guided hazard documentation
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            Capture hazard details, attach annotated evidence, map likely standards, assess risk, and prepare corrective actions for review.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["1", "Identify", "Document the observed hazard and location."],
            ["2", "Evidence", "Capture or upload photos and annotations."],
            ["3", "SafeScope", "Review standards, risk, and corrective actions."],
          ].map(([step, title, body]) => (
            <div key={step} className="rounded-xl border border-slate-200 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102A43] text-xs font-black text-white">
                {step}
              </div>
              <h3 className="mt-3 font-black text-slate-900">{title}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{body}</p>
            </div>
          ))}
        </div>

        <Link
          href="/inspection"
          className="mt-5 inline-block rounded-xl bg-[#1D72B8] px-5 py-3 text-sm font-black text-white"
        >
          Start Inspection
        </Link>
      </div>
    </section>
  );
}
