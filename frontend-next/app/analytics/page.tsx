const morningBrief = [
  {
    rank: "01",
    label: "Critical exposure concentration",
    desc: "Open findings show elevated risk concentration around guarding, access, and energy-control conditions.",
  },
  {
    rank: "02",
    label: "Corrective action velocity",
    desc: "Priority should remain on closing high-risk actions before adding additional low-impact observations.",
  },
  {
    rank: "03",
    label: "Regulatory intelligence",
    desc: "SafeScope trend review indicates recurring standards themes that should be validated during supervisor review.",
  },
];

const metrics = [
  {
    category: "Executive Risk Metrics",
    lead: "Organizational Risk Signal",
    desc: "Core decision-support indicators for operational safety performance.",
    items: [
      {
        label: "Composite Risk Index",
        value: "82",
        trend: "+12% elevated",
        trendColor: "#DC2626",
        equation: "(Severity × Likelihood × Exposure) ÷ Control Strength",
        justification:
          "A weighted index gives leadership a single operational risk signal without hiding the underlying findings.",
        impact:
          "Use this score to prioritize resources, supervisor attention, and corrective action verification.",
      },
      {
        label: "Corrective Action Closure Rate",
        value: "68%",
        trend: "-8% below target",
        trendColor: "#F97316",
        equation: "Closed Actions ÷ Total Assigned Actions",
        justification:
          "Closure rate reflects whether identified hazards are being converted into completed controls.",
        impact:
          "A falling closure rate indicates operational drag and possible repeat exposure.",
      },
    ],
  },
  {
    category: "Predictive Safety Intelligence",
    lead: "Leading Indicator Strength",
    desc: "Signals that help identify where future serious exposure may emerge.",
    items: [
      {
        label: "Repeat Hazard Density",
        value: "4.2",
        trend: "Recurring cluster",
        trendColor: "#DC2626",
        equation: "Repeat Findings ÷ Inspection Area",
        justification:
          "Repeated findings in the same category can indicate weak controls, training gaps, or supervision drift.",
        impact:
          "Focus audits and coaching on categories showing repeated recurrence.",
      },
      {
        label: "Verification Reliability",
        value: "91%",
        trend: "+6% improved",
        trendColor: "#16A34A",
        equation: "Verified Corrective Actions ÷ Reported Completed Actions",
        justification:
          "Verification reliability helps separate paperwork closure from actual field correction.",
        impact:
          "High verification reliability supports stronger audit defensibility.",
      },
    ],
  },
];

const complianceRadarData = [
  { subject: "Guarding", A: 87 },
  { subject: "Electrical", A: 75 },
  { subject: "Access", A: 68 },
  { subject: "PPE", A: 56 },
  { subject: "Housekeeping", A: 73 },
];

const spcData = [
  { month: "Jan", findings: 18 },
  { month: "Feb", findings: 22 },
  { month: "Mar", findings: 17 },
  { month: "Apr", findings: 29 },
  { month: "May", findings: 24 },
];

const riskData = [
  { name: "Guarding", likelihood: 4, severity: 5 },
  { name: "Electrical", likelihood: 3, severity: 5 },
  { name: "Access", likelihood: 4, severity: 3 },
  { name: "Housekeeping", likelihood: 3, severity: 2 },
];

const benchmarkData = [
  { site: "Plant East", score: 82 },
  { site: "Warehouse North", score: 76 },
  { site: "Quarry South", score: 71 },
  { site: "Maintenance", score: 68 },
];

const proGatingContent = {
  title: "Unlock Advanced Analytics",
  description:
    "Enable deeper benchmarking, exportable intelligence summaries, predictive indicators, and executive-ready trend reports.",
  cta: "Upgrade Analytics",
};

function ChartPlaceholder({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: string[];
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-[18px]">
      <h3 className="text-base font-black text-slate-900">{title}</h3>
      <p className="mb-3 mt-1 text-xs text-slate-500">{subtitle}</p>

      <div className="rounded-[14px] border border-slate-200 bg-slate-50 p-3.5">
        {rows.map((row) => (
          <p key={row} className="mb-1.5 text-[13px] font-bold text-slate-700">
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <section>
      <div className="mb-[18px] border-l-4 border-[#F97316] pl-4">
        <h1 className="text-[28px] font-black text-slate-900">
          Safety Intelligence Dashboard
        </h1>
        <p className="mt-1.5 text-sm leading-[21px] text-slate-500">
          Scientific decision-support environment validating organizational resilience.
        </p>
      </div>

      <div className="mb-7 rounded-[24px] bg-slate-900 p-[22px]">
        <p className="mb-[18px] text-[11px] font-black uppercase tracking-[1px] text-orange-500">
          Morning Intelligence Brief
        </p>

        {morningBrief.map((item) => (
          <div key={item.rank} className="mb-[18px] flex gap-3.5">
            <p className="w-[42px] text-[27px] font-black text-white/20">
              {item.rank}
            </p>

            <div className="flex-1">
              <p className="mb-1 text-[15px] font-black text-white">
                {item.label}
              </p>
              <p className="text-[13px] leading-[19px] text-slate-400">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {metrics.map((chapter) => (
        <div key={chapter.category} className="mb-[30px]">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[1px] text-orange-500">
            {chapter.category}
          </p>
          <h2 className="mb-1.5 text-[22px] font-black text-slate-900">
            {chapter.lead}
          </h2>
          <p className="mb-4 text-sm leading-[21px] text-slate-500">
            {chapter.desc}
          </p>

          {chapter.items.map((item) => (
            <div
              key={item.label}
              className="mb-3.5 rounded-[20px] border border-l-4 border-slate-200 border-l-slate-900 bg-white p-[18px]"
            >
              <div className="mb-2.5 flex justify-between gap-3">
                <p className="flex-1 text-xs font-black uppercase text-slate-500">
                  {item.label}
                </p>
                <p
                  className="text-[11px] font-black"
                  style={{ color: item.trendColor }}
                >
                  {item.trend}
                </p>
              </div>

              <p className="mb-3.5 text-[38px] font-black text-slate-900">
                {item.value}
              </p>

              <div className="mb-3 rounded-[14px] border border-slate-200 bg-slate-50 p-3">
                <p className="mb-1 text-[10px] font-black uppercase text-slate-400">
                  Formula
                </p>
                <p className="text-[13px] font-extrabold text-slate-900">
                  {item.equation}
                </p>
              </div>

              <p className="mb-1 mt-2 text-xs font-black text-slate-900">
                Why it matters
              </p>
              <p className="text-[13px] leading-[19px] text-slate-500">
                {item.justification}
              </p>

              <p className="mb-1 mt-2 text-xs font-black text-slate-900">
                Strategic impact
              </p>
              <p className="text-[13px] leading-[19px] text-slate-500">
                {item.impact}
              </p>
            </div>
          ))}
        </div>
      ))}

      <div className="mb-[30px]">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[1px] text-orange-500">
          Deep Analytical Intelligence
        </p>
        <h2 className="mb-1.5 text-[22px] font-black text-slate-900">
          Multi-Dimensional Risk Mapping
        </h2>
        <p className="mb-4 text-sm leading-[21px] text-slate-500">
          Native chart rendering will be added after the core screens are stable. These placeholders preserve the legacy analytics structure.
        </p>

        <div className="grid gap-3.5 md:grid-cols-2">
          <ChartPlaceholder
            title="Regulatory Hot Zones"
            subtitle="Normalized compliance density"
            rows={complianceRadarData.map((item) => `${item.subject}: ${item.A}`)}
          />

          <ChartPlaceholder
            title="Process Stability (SPC)"
            subtitle="Statistical variance detection"
            rows={spcData.map((item) => `${item.month}: ${item.findings} findings`)}
          />

          <ChartPlaceholder
            title="Risk Priority Matrix (RPN)"
            subtitle="Likelihood x Severity"
            rows={riskData.map(
              (item) => `${item.name}: L${item.likelihood} x S${item.severity}`
            )}
          />

          <ChartPlaceholder
            title="Maturity Benchmarking"
            subtitle="Site-specific performance ranking"
            rows={benchmarkData.map((item) => `${item.site}: ${item.score}`)}
          />
        </div>
      </div>

      <div className="mb-2.5 rounded-[22px] bg-slate-900 p-[22px]">
        <h2 className="mb-2 text-xl font-black text-white">
          {proGatingContent.title}
        </h2>
        <p className="mb-4 text-sm leading-[21px] text-slate-300">
          {proGatingContent.description}
        </p>
        <div className="rounded-full bg-orange-500 py-[13px] text-center">
          <p className="text-sm font-black text-white">{proGatingContent.cta}</p>
        </div>
      </div>
    </section>
  );
}
