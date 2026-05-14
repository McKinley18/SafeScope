export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export async function runSafeScopeV2Classify(payload: {
  text?: string;
  hazardCategory?: string;
  description?: string;
  location?: string;
  evidenceNotes?: string;
  agencyMode?: string;
  riskProfileId?: string;
  scopes?: string[];
  evidenceTexts?: string[];
}) {
  const text = payload.text || [
    payload.hazardCategory ? `Hazard Category: ${payload.hazardCategory}` : "",
    payload.description ? `Description: ${payload.description}` : "",
    payload.location ? `Location: ${payload.location}` : "",
    payload.evidenceNotes ? `Evidence Notes: ${payload.evidenceNotes}` : "",
    payload.agencyMode ? `Agency Mode: ${payload.agencyMode}` : "",
    payload.riskProfileId ? `Risk Profile: ${payload.riskProfileId}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`${API_BASE_URL}/safescope-v2/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "SafeScope classification failed.");
  }

  return response.json();
}

export async function sendSafeScopeFeedback(payload: any) {
  const response = await fetch(`${API_BASE_URL}/standards/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("SafeScope feedback failed.");
  }

  return response.json();
}
