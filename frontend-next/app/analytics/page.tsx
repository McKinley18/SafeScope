import StatusBadge from "@/components/ui/StatusBadge";

const intelligenceBrief = [
  {
    rank: "01",
    title: "Critical exposure concentration",
    body: "Guarding, access, and energy-control conditions are carrying the highest operational risk.",
  },
  {
    rank: "02",
    title: "Corrective action velocity",
    body: "Close high-risk actions before expanding lower-impact observations.",
  },
  {
    rank: "03",
    title: "Regulatory intelligence",
    body: "SafeScope is detecting recurring standards themes that need supervisor validation.",
  },
];

const executiveMetrics = [
  {
    label: "Composite Risk Index",
    value: "82",
    trend: "+12% elevated",
    tone: "critical" as const,
    meaning: "Weighted signal for current operational safety risk.",
    calculation: "Severity × Likelihood × Exposure ÷ Control Strength",
  },
  {
    label: "Closure Rate",
    value: "68%",
    trend: "-8% target gap",
    tone: "high" as const,
    meaning: "How quickly identified hazards become verified controls.",
    calculation: "Closed Actions ÷ Total Assigned Actions",
  },
  {
    label: "Verification Reliability",
    value: "91%",
    trend: "+6% improved",
    tone: "success" as const,
    meaning: "Separates paperwork closure from actual field correction.",
    calculation: "Verified Actions ÷ Reported Completed Actions",
  },
];

const riskThemes = [
  ["Guarding", 87],
  ["Electrical", 75],
  ["Access", 68],
  ["PPE", 56],
  ["Housekeeping", 73],
];

const siteScores = [
  ["Plant East", 82],
  ["Warehouse North", 76],
  ["Quarry South", 71],
  ["Maintenance", 68],
];

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-[#1D72B8]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <section className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-[#0B1320] via-[#102A43] to-[#0B1320] p-6 text-white shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
          Analytics Intelligence
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Insights that prioritize action.
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
          Executive risk indicators, SafeScope trends, and corrective action signals organized for faster decisions.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] bg-[#0B1320] p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F97316]">
            Morning Brief
          </p>
          <h2 className="mt-2 text-2xl font-black">What to review first</h2>

          <div className="mt-5 space-y-5">
            {intelligenceBrief.map((item) => (
              <div key={item.rank} className="flex gap-4">
                <p className="w-10 text-2xl font-black text-white/20">{item.rank}</p>
                <div>
                  <p className="text-sm font-black text-white">{item.title}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-400">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {executiveMetrics.map((metric) => (
            <div key={metric.label} className="border-b border-slate-200 pb-4 sm:border-b-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  {metric.label}
                </p>
                <StatusBadge tone={metric.tone}>{metric.trend}</StatusBadge>
              </div>
              <p className="mt-3 text-4xl font-black text-slate-900">{metric.value}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{metric.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-slate-200 pt-7 lg:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
            Risk Themes
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Compliance hot zones
          </h2>
          <div className="mt-5 space-y-4">
            {riskThemes.map(([label, value]) => (
              <ProgressRow key={label} label={String(label)} value={Number(value)} />
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-slate-100 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
            Benchmarking
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Site performance signals
          </h2>
          <div className="mt-5 space-y-4">
            {siteScores.map(([label, value]) => (
              <ProgressRow key={label} label={String(label)} value={Number(value)} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-blue-100 bg-[#E8F4FF] p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
          How Sentinel Calculates Risk
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {executiveMetrics.map((metric) => (
            <div key={metric.label}>
              <p className="text-sm font-black text-slate-900">{metric.label}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                {metric.calculation}
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
