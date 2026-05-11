export const morningBrief = [
  {
    rank: "01",
    label: "Lockout/Tagout Critical Failure",
    desc: "Plant East has exceeded its statistical variance (+2.4σ) for LOTO findings. Immediate departmental audit required.",
  },
  {
    rank: "02",
    label: "Fall Hazard Mitigation Overdue",
    desc: 'Warehouse North has 4 "High" RPN findings remaining open beyond the 72hr mean mitigation target.',
  },
  {
    rank: "03",
    label: "Audit Fatigue Warning",
    desc: 'Safety Audit Findings Rate (SAFR) has declined 15% in high-risk zones, suggesting a loss of professional vigilance.',
  },
];

export const metrics = [
  {
    category: "Tactical Leading Indicators",
    lead: "Immediate Operational Risk",
    desc: "Metrics that track the agility and sensitivity of your safety frontline.",
    items: [
      {
        label: "Mean Mitigation Time (MMT)",
        value: "3.2 Days",
        trend: "↑ 14% Surge",
        trendColor: "#DC2626",
        equation: "Σ (Closed Date - Open Date) / count(Mitigations)",
        justification: "Measures management responsiveness and organizational agility.",
        impact:
          'A rising MMT is the earliest indicator of "Normalization of Deviance" — where hazards are accepted as status quo.',
      },
      {
        label: "Risk Exposure Ratio (RER)",
        value: "0.24",
        trend: "↓ 2% Stable",
        trendColor: "#059669",
        equation: "Σ (Finding RPN) / (Inspections x Hazard Capacity)",
        justification: "Normalizes hazard volume against audit frequency.",
        impact:
          'Prevents "Ghost Safety" — where a site appears safe simply because it is not being inspected.',
      },
      {
        label: "Statistical Variance (Sigma)",
        value: "+1.4s",
        trend: "Critical Deviation",
        trendColor: "#DC2626",
        equation: "(Current Count - Historical Mean) / σ",
        justification: "Differentiates random noise from systemic process failure.",
        impact:
          "Deviations above +3σ indicate a process has lost control, predicting imminent incidents.",
      },
    ],
  },
  {
    category: "Strategic Efficiency Metrics",
    lead: "Culture & Systemic Integrity",
    desc: "Metrics that validate the long-term efficacy and ROI of the safety program.",
    items: [
      {
        label: "Hazard Recurrence Rate (HRR)",
        value: "8.4%",
        trend: "↑ 1.2% Low Efficacy",
        trendColor: "#DC2626",
        equation: "(Count of Recurrent Findings / Total Unique Findings) x 100",
        justification:
          "Measures the technical quality and permanence of corrective actions.",
        impact:
          'Exposes "Pencil-Whipping." High HRR indicates superficial fixes are being applied.',
      },
      {
        label: "Risk Reduction Velocity (RRV)",
        value: "142 pts/wk",
        trend: "↑ 18% High Impact",
        trendColor: "#059669",
        equation: "Σ (Initial RPN - Mitigated RPN) / Δ Time",
        justification: "Quantifies the mathematical speed of hazard removal.",
        impact:
          'The "True ROI." RRV allows leadership to see exactly how much risk potential has been removed.',
      },
      {
        label: "Safety Audit Findings Rate (SAFR)",
        value: "2.4 / hr",
        trend: "↓ 0.4 Fatigue Warning",
        trendColor: "#F97316",
        equation: "Total Findings Logged / Total Audit Man-Hours",
        justification:
          "Monitors the professional vigilance and sensitivity of auditors.",
        impact:
          'Identifies "Audit Fatigue." A declining SAFR suggests auditors are losing their "Eye for Risk."',
      },
    ],
  },
];

export const complianceRadarData = [
  { subject: "Electrical", A: 120 },
  { subject: "Fall Protection", A: 98 },
  { subject: "PPE", A: 86 },
  { subject: "Machine Guard", A: 99 },
  { subject: "HazCom", A: 85 },
  { subject: "LOTO", A: 65 },
];

export const spcData = [
  { month: "Jan", findings: 12 },
  { month: "Feb", findings: 15 },
  { month: "Mar", findings: 8 },
  { month: "Apr", findings: 19 },
];

export const riskData = [
  { likelihood: 2, severity: 4, name: "Slip/Trip" },
  { likelihood: 4, severity: 5, name: "Electrical" },
  { likelihood: 1, severity: 2, name: "PPE" },
  { likelihood: 3, severity: 3, name: "Machine Guarding" },
];

export const benchmarkData = [
  { site: "Warehouse N.", score: 82 },
  { site: "Plant E.", score: 94 },
  { site: "Dist. Center S.", score: 68 },
];

export const proGatingContent = {
  title: "🚀 Predictive Modeling Gated",
  description:
    "Advanced Statistical Process Control (SPC) and Risk Priority Matrix (RPN) mapping are reserved for Pro and Enterprise users.",
  cta: "Upgrade to Sentinel Pro",
};
