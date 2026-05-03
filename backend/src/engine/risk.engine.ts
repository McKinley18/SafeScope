export type RiskInput = {
  industry?: string;
  severity?: string;
  narrative?: string;
};

const severityMap: any = {
  high: 5,
  medium: 3,
  low: 1,
};

const probabilityFromText = (text: string): number => {
  const t = text.toLowerCase();

  if (t.includes("exposed") || t.includes("unguarded") || t.includes("immediate")) return 5;
  if (t.includes("frequent") || t.includes("regular")) return 4;
  if (t.includes("possible")) return 3;
  if (t.includes("unlikely")) return 2;

  return 3; // default moderate
};

const exposureFromText = (text: string): number => {
  const t = text.toLowerCase();

  if (t.includes("continuous") || t.includes("always")) return 5;
  if (t.includes("daily")) return 4;
  if (t.includes("periodic")) return 3;
  if (t.includes("rare")) return 2;

  return 3;
};

export const calculateRisk = (input: RiskInput) => {
  const severityScore = severityMap[(input.severity || "").toLowerCase()] || 3;

  const narrative = input.narrative || "";

  const probabilityScore = probabilityFromText(narrative);
  const exposureScore = exposureFromText(narrative);

  // Weighted model
  const riskScore = (
    severityScore * 0.5 +
    probabilityScore * 0.3 +
    exposureScore * 0.2
  );

  let riskBand = "LOW";
  if (riskScore >= 4.5) riskBand = "CRITICAL";
  else if (riskScore >= 3.5) riskBand = "HIGH";
  else if (riskScore >= 2.5) riskBand = "MODERATE";

  return {
    severityScore,
    probabilityScore,
    exposureScore,
    riskScore: Number(riskScore.toFixed(2)),
    riskBand,
  };
};
