const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export type SafeScopeMatchPayload = {
  text: string;
  category: string;
  mode: "msha" | "osha";
};

export type SafeScopeStandardMatch = {
  citation: string;
  description: string;
  confidence: number;
};

export async function runSafeScopeMatch(
  payload: SafeScopeMatchPayload
): Promise<SafeScopeStandardMatch[]> {
  const response = await fetch(`${API_BASE_URL}/standards/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`SafeScope match failed with status ${response.status}`);
  }

  return response.json();
}

export async function sendSafeScopeFeedback(payload: {
  text: string;
  category: string;
  mode: "msha" | "osha";
  citation: string;
  action: "accepted" | "rejected" | "changed" | "flagged";
  notes?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/standards/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`SafeScope feedback failed with status ${response.status}`);
  }

  return response.json();
}

export type SafeScopeV2SuggestedStandard = {
  citation: string;
  rationale: string;
  agency?: "MSHA" | "OSHA";
  scope?: "msha" | "osha_general" | "osha_construction";
};

export type SafeScopeV2ExcludedStandard = {
  citation: string;
  reason: string;
};

export type SafeScopeV2RiskBand = "Low" | "Moderate" | "High" | "Critical";

export type SafeScopeV2RiskResult = {
  riskScore: number;
  riskBand: SafeScopeV2RiskBand;
  imminentDanger: boolean;
  fatalityPotential: "low" | "medium" | "high";
  requiresShutdown: boolean;
  reasoning: string[];
  operationalRisk?: {
    severity: number;
    likelihood: number;
    matrixScore: number;
    matrixBand: SafeScopeV2RiskBand;
  };
  aiRisk?: {
    escalationScore: number;
    escalationBand: SafeScopeV2RiskBand;
    imminentDanger: boolean;
    fatalityPotential: "low" | "medium" | "high";
    requiresShutdown: boolean;
    escalationReasons: string[];
  };
};



export type SafeScopeV2ExpandedContext = {
  environment: string;
  exposureType: string[];
  inferredActivities: string[];
  probableConsequences: string[];
  controlFailures: string[];
  operationalState: string[];
  humanFactors: string[];
  reasoning: string[];
  contextConfidence?: {
    score: number;
    band: "low" | "medium" | "high";
    missingSignals: string[];
  };
};

export type SafeScopeV2GeneratedAction = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignedRole: string;
  dueDate: string;
  requiresShutdown?: boolean;
  referenceStandards?: string[];
  suggestedFixes?: string[];
  sourceHazard: string;
};

export type SafeScopeV2AdditionalHazard = {
  classification: string;
  confidence: number;
  confidenceBand: "low" | "medium" | "high";
  evidenceTokens: string[];
  requiresHumanReview: boolean;
  explanation: string;
  suggestedStandards: SafeScopeV2SuggestedStandard[];
  excludedStandards?: SafeScopeV2ExcludedStandard[];
  risk?: SafeScopeV2RiskResult;
  expandedContext?: SafeScopeV2ExpandedContext;
  generatedActions?: SafeScopeV2GeneratedAction[];
};

export type SafeScopeV2Result = {
  classification: string;
  confidence: number;
  confidenceBand: "low" | "medium" | "high";
  evidenceTokens: string[];
  ambiguityWarnings: string[];
  requiresHumanReview: boolean;
  explanation: string;
  suggestedStandards: SafeScopeV2SuggestedStandard[];
  excludedStandards?: SafeScopeV2ExcludedStandard[];
  risk?: SafeScopeV2RiskResult;
  expandedContext?: SafeScopeV2ExpandedContext;
  generatedActions?: SafeScopeV2GeneratedAction[];
  additionalHazards?: SafeScopeV2AdditionalHazard[];
};

export async function runSafeScopeV2Classify(
  text: string,
  scopes?: string[],
  evidenceTexts?: string[]
): Promise<SafeScopeV2Result> {
  const response = await fetch(`${API_BASE_URL}/safescope-v2/classify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, scopes, evidenceTexts }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "SafeScope v2 classification failed.");
  }

  return response.json();
}
