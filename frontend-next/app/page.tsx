import Link from "next/link";

const lifecycle = [
  {
    title: "Inspection Report Builder",
    text: "Create structured safety reports with hazards, evidence, risk ratings, standards, and corrective actions.",
  },
  {
    title: "SafeScope Intelligence",
    text: "Map findings to applicable safety standards and support consistent review decisions.",
  },
  {
    title: "Executive Analytics",
    text: "Track mitigation speed, recurring hazards, audit fatigue, risk exposure, and site maturity.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "For testing the inspection workflow.",
    features: ["Basic reports", "Manual risk scoring", "Limited analytics"],
  },
  {
    name: "Sentinel Pro",
    price: "$49",
    desc: "For professionals managing active safety programs.",
    features: ["SafeScope mapping", "Executive analytics", "Corrective action tracking"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For companies with multiple sites and teams.",
    features: ["Multi-site governance", "Advanced permissions", "Predictive intelligence"],
  },
];

export default function MarketingPage() {
  return (
    <section>
      <div className="mb-[26px] rounded-[28px] bg-slate-900 p-[26px]">
        <p className="mb-3 text-xs font-black uppercase tracking-[1px] text-orange-500">
          Sentinel Safety
        </p>
        <h1 className="mb-3 text-[31px] font-black leading-[37px] text-white">
          Modern safety intelligence for serious operations.
        </h1>
        <p className="text-[15px] leading-[23px] text-slate-300">
          Build inspection reports, identify risk trends, and turn safety findings into accountable corrective action.
        </p>
      </div>

      <div className="mb-[30px]">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[1px] text-orange-500">
          Platform Workflow
        </p>
        <h2 className="mb-[18px] text-[23px] font-black leading-[29px] text-slate-900">
          Built for the full inspection lifecycle
        </h2>

        {lifecycle.map((item, index) => (
          <div key={item.title} className="flex gap-4 border-b border-slate-200 py-4">
            <p className="w-[46px] text-[30px] font-black text-slate-300">
              0{index + 1}
            </p>

            <div className="flex-1">
              <h3 className="mb-1 text-lg font-black text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm leading-[21px] text-slate-500">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-[30px]">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[1px] text-orange-500">
          Plans
        </p>
        <h2 className="mb-[18px] text-[23px] font-black leading-[29px] text-slate-900">
          Choose the level of safety intelligence you need
        </h2>

        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`mb-3.5 rounded-[22px] border border-slate-200 bg-white p-5 ${
              plan.name === "Sentinel Pro"
                ? "border-l-[5px] border-l-orange-500 bg-orange-50"
                : ""
            }`}
          >
            <h3 className="mb-1.5 text-[19px] font-black text-slate-900">
              {plan.name}
            </h3>
            <p className="mb-1.5 text-[32px] font-black text-slate-900">
              {plan.price}
            </p>
            <p className="mb-3 text-sm leading-[21px] text-slate-500">
              {plan.desc}
            </p>

            {plan.features.map((feature) => (
              <p key={feature} className="mb-1.5 text-sm font-bold text-slate-700">
                • {feature}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="rounded-[28px] bg-slate-900 p-6 text-center">
        <h2 className="mb-2 text-2xl font-black leading-[30px] text-white">
          Ready to build your safety workspace?
        </h2>
        <p className="mb-5 text-sm leading-[21px] text-slate-300">
          Create an account to start building reports, tracking actions, and using Sentinel Safety intelligence.
        </p>

        <Link
          href="/login"
          className="mx-auto flex h-[52px] w-[220px] items-center justify-center rounded-full bg-orange-500 text-[15px] font-black text-white"
        >
          Create Account
        </Link>

        <Link href="/login" className="mt-4 block text-[13px] font-extrabold text-slate-300">
          Already have an account? Sign in
        </Link>
      </div>
    </section>
  );
}
