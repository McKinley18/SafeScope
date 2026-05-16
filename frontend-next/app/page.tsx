import Link from "next/link";

const capabilities = [
  {
    title: "SafeScope Intelligence",
    text: "Analyze inspection findings with hazard classification, causal reasoning, energy-transfer awareness, confidence calibration, and standards defensibility support.",
  },
  {
    title: "Domain-Specific Safety Logic",
    text: "Apply specialized reference intelligence for confined space, LOTO, mobile equipment, trenching, electrical, lifting and rigging, and HazCom/GHS scenarios.",
  },
  {
    title: "Audit-Ready Traceability",
    text: "Capture reasoning snapshots, engine metadata, review signals, and supervisor validation history to support defensible safety decisions.",
  },
  {
    title: "Inspection-to-Action Workflow",
    text: "Move from observed hazards to standards review, risk scoring, corrective actions, verification language, and report-ready documentation.",
  },
];

const trust = [
  "MSHA and OSHA standards support",
  "Curated + CFR-backed standard matching",
  "Supervisor validation workflow",
  "Workspace-scoped learning foundations",
  "Confidence and reasoning drift monitoring",
  "Decision-support disclaimers built into the workflow",
];

const domains = [
  "Confined Space",
  "LOTO / Energy Isolation",
  "Mobile Equipment",
  "Trenching",
  "Electrical",
  "Lifting & Rigging",
  "HazCom / GHS",
];

export default function MarketingPage() {
  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-[32px] bg-[#0B1320] p-8 text-white shadow-sm md:p-12">
        <p className="mb-3 text-xs font-black uppercase tracking-[1px] text-[#5DB7FF]">
          Sentinel Safety
        </p>

        <h1 className="max-w-5xl text-4xl font-black leading-tight md:text-6xl">
          Safety intelligence for inspections, standards, and corrective action.
        </h1>

        <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-300 md:text-lg">
          Sentinel Safety combines structured inspection workflows with SafeScope, an operational safety intelligence engine built to help identify hazards, reason through exposure pathways, support standards review, and produce stronger safety records.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full bg-[#1D72B8] px-6 py-3 text-sm font-black text-white">
            Create an Account
          </Link>
          <Link href="/login" className="rounded-full bg-white px-6 py-3 text-sm font-black !text-[#0B1320]">
            Sign In
          </Link>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-[1px] text-[#1D72B8]">
          Platform Capabilities
        </p>
        <h2 className="mb-5 text-3xl font-black text-slate-900">
          Built for serious safety operations.
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {capabilities.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[1px] text-[#1D72B8]">
          SafeScope Domain Intelligence
        </p>
        <h2 className="text-3xl font-black text-slate-900">
          More than a generic hazard lookup.
        </h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
          SafeScope is being developed to reason across specialized safety domains and identify when multiple operational risks interact.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {domains.map((domain) => (
            <span key={domain} className="rounded-full bg-[#E8F4FF] px-3 py-2 text-xs font-black text-[#1D72B8]">
              {domain}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[1px] text-[#1D72B8]">
          Trust Layer
        </p>
        <h2 className="text-3xl font-black text-slate-900">
          Explainable. Reviewable. Auditable.
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {trust.map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-black text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-[#0F172A] p-8 text-center text-white">
        <h2 className="text-3xl font-black">Start building your safety workspace.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
          Use Sentinel Safety to document hazards, support qualified review, and create stronger inspection and corrective action records.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="rounded-full bg-[#1D72B8] px-6 py-3 text-sm font-black text-white">
            Create an Account
          </Link>
          <Link href="/login" className="rounded-full bg-white px-6 py-3 text-sm font-black !text-[#0B1320]">
            Already have an account?
          </Link>
        </div>
      </div>
    </section>
  );
}
