export type SafeScopeRiskProfileId =
  | "simple_4x4"
  | "standard_5x5"
  | "advanced_6x6";

export type SafeScopePriorFinding = {
  id?: string | number;
  hazardCategory?: string;
  classification?: string;
  description?: string;
  location?: string;
  riskScore?: number;
  createdAt?: string;
  safeScopeResult?: any;
};

export type SafeScopeIntelligenceContext = {
  fusedText: string;
  promotedPrimary: any;
  classifierResult: any;
  evidenceTexts?: string[];
  expandedContext: any;
  primaryStandardsResult: any;
  generatedActions: any[];
  additionalHazards: any[];
  priorFindings?: SafeScopePriorFinding[];
};

export type SafeScopeIntelligenceResult = {
  confidenceIntelligence?: any;
  operationalReasoning?: any;
  trendIntelligence?: any;
  energyTransferIntelligence?: any;
  evidenceQuality?: any;
  controlIntelligence?: any;
  barrierIntelligence?: any;
  eventSequence?: any;
  operationalState?: any;
  humanFactors?: any;
  contradictionIntelligence?: any;
  actionEffectiveness?: any;
  counterfactualIntelligence?: any;
  standardsReasoning?: any;
  decisionExplainability?: any;
  hazardGraph?: any;
  exposurePathIntelligence?: any;
  correlationIntelligence?: any;
  siteMemory?: any;
};
