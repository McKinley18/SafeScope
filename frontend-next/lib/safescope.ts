export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("sentinel_auth_token") ||
    window.localStorage.getItem("token")
  );
}

function authHeaders() {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function runSafeScopeV2Classify(payload: {
  text: string;
  evidenceTexts?: string[];
  scopes?: string[];
  riskProfileId?: "simple_4x4" | "standard_5x5" | "advanced_6x6";
  workspaceId?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/safescope-v2/classify`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      text: payload.text,
      scopes: payload.scopes || ["msha", "osha_general", "osha_construction"],
      evidenceTexts: payload.evidenceTexts || [],
      riskProfileId: payload.riskProfileId || "standard_5x5",
      ...(payload.workspaceId ? { workspaceId: payload.workspaceId } : {}),
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
  action: "accepted" | "rejected" | "flagged" | "changed";
  notes?: string;
  replacementCitation?: string;
  confidenceBefore?: number;
  riskProfileId?: string;
  reportId?: string;
  findingId?: string;
}) {
  const recordPayload = {
    workspaceId: undefined,
    userId: undefined,
    reportId: payload.reportId,
    findingId: payload.findingId,
    classification: payload.category,
    citation: payload.citation,
    action: payload.action,
    replacementCitation: payload.replacementCitation,
    reason: payload.notes || payload.text,
    confidenceBefore: payload.confidenceBefore,
    riskProfileId: payload.riskProfileId,
    reviewerRole: "Safety Manager",
  };

  const response = await fetch(`${API_BASE_URL}/safescope-v2/feedback`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(recordPayload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const saved = await response.json();

  const existing =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("sentinel_safescope_feedback") || "[]")
      : [];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      "sentinel_safescope_feedback",
      JSON.stringify([saved, ...existing])
    );
  }

  return saved;
}
