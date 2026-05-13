export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function runSafeScopeV2Classify(payload: {
  text: string;
  evidenceTexts?: string[];
  scopes?: string[];
  riskProfileId?: "simple_4x4" | "standard_5x5" | "advanced_6x6";
}) {
  const response = await fetch(`${API_BASE_URL}/safescope-v2/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: payload.text,
      scopes: payload.scopes || ["msha", "osha_general", "osha_construction"],
      evidenceTexts: payload.evidenceTexts || [],
      riskProfileId: payload.riskProfileId || "standard_5x5",
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function sendSafeScopeFeedback(payload: {
  text: string;
  category: string;
  mode: string;
  citation: string;
  action: "accepted" | "rejected" | "flagged";
  notes?: string;
}) {
  const existing =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("sentinel_safescope_feedback") || "[]")
      : [];

  const record = {
    id: `feedback-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      "sentinel_safescope_feedback",
      JSON.stringify([record, ...existing])
    );
  }

  return record;
}
