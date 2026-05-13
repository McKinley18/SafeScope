import Link from "next/link";

const features = [
  {
    title: "SafeScope Intelligence",
    text: "Classify hazards, infer context, estimate confidence, and map findings to MSHA and OSHA standards using curated logic plus CFR-backed matching.",
  },
  {
    title: "Inspection Report Builder",
    text: "Capture findings, locations, evidence notes, photos, risk ratings, standards, and corrective actions in a structured workflow.",
  },
  {
    title: "Risk Matrix Flexibility",
    text: "Support 4x4, 5x5, and 6x6 risk matrices so teams can align scoring with their safety program.",
  },
  {
    title: "Corrective Action Control",
    text: "Convert findings into accountable corrective actions with priority, due dates, shutdown indicators, and verification language.",
  },
];

const trust = [
  "MSHA and OSHA standards support",
  "Curated + CFR database matching",
  "Confidence intelligence and missing-information prompts",
  "Workspace-scoped learning that does not corrupt regulatory truth",
];

export default function MarketingPage() {
  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-[32px] bg-[#0B1320] p-8 text-white shadow-sm md:p-12">
        <p className="mb-3 text-xs font-black uppercase tracking-[1px] text-[#5DB7FF]">
          Sentinel Safety
        </p>

        <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          Safety intelligence built for serious operations.
        </h1>

        <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-300 md:text-lg">
          Build professional inspection reports, classify hazards with SafeScope, map findings to applicable standards, and turn risk into accountable corrective action.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full bg-[#1D72B8] px-6 py-3 text-sm font-black text-white">
            Create an Account
          </Link>
          <Link href="/login" className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900">
            Sign In
          </Link>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-[1px] text-[#1D72B8]">
          Platform
        </p>
        <h2 className="mb-5 text-3xl font-black text-slate-900">
          From inspection to intelligence
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[1px] text-[#1D72B8]">
          Trust Layer
        </p>
        <h2 className="text-3xl font-black text-slate-900">
          Regulation-grounded. Explainable. Auditable.
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
          Use Sentinel Safety to document hazards, support better review decisions, and create stronger safety records.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="rounded-full bg-[#1D72B8] px-6 py-3 text-sm font-black text-white">
            Create an Account
          </Link>
          <Link href="/login" className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900">
            Already have an account?
          </Link>
        </div>
      </div>
    </section>
  );
}
