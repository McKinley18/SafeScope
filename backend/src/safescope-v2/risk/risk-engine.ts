import { RISK_MATRIX } from './risk-matrix.seed';

export type RiskInput = {
  text: string;
  classification: string;
  environment?: keyof typeof RISK_MATRIX.environmentMultiplier;
};

export type RiskBand = 'Low' | 'Moderate' | 'High' | 'Critical';

export type RiskResult = {
  // Backward-compatible fields
  riskScore: number;
  riskBand: RiskBand;
  imminentDanger: boolean;
  fatalityPotential: 'low' | 'medium' | 'high';
  requiresShutdown: boolean;
  reasoning: string[];

  // New structured risk model
  operationalRisk: {
    severity: number;
    likelihood: number;
    matrixScore: number;
    matrixBand: RiskBand;
  };

  aiRisk: {
    escalationScore: number;
    escalationBand: RiskBand;
    imminentDanger: boolean;
    fatalityPotential: 'low' | 'medium' | 'high';
    requiresShutdown: boolean;
    escalationReasons: string[];
  };
};

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

function bandFromMatrixScore(score: number): RiskBand {
  if (score >= 17) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 5) return 'Moderate';
  return 'Low';
}

export function evaluateRisk(input: RiskInput): RiskResult {
  const text = normalize(input.text || '');
  const classification = input.classification || 'Review Required';

  const imminentDanger = RISK_MATRIX.imminentDangerTriggers.some((trigger) =>
    text.includes(trigger),
  );

  let severity = RISK_MATRIX.severity.moderate;
  let likelihood = RISK_MATRIX.likelihood.possible;
  let fatalityPotential: RiskResult['fatalityPotential'] = 'medium';
  const reasoning: string[] = [];

  if (
    ['Electrical', 'Fall', 'Powered Mobile Equipment', 'Machine'].includes(
      classification,
    )
  ) {
    severity = RISK_MATRIX.severity.major;
    fatalityPotential = 'high';
    reasoning.push(`${classification} hazards can create serious or fatal exposure.`);
  }

  if (imminentDanger) {
    severity = RISK_MATRIX.severity.critical;
    likelihood = RISK_MATRIX.likelihood.likely;
    fatalityPotential = 'high';
    reasoning.push('Imminent-danger trigger detected in finding text.');
  }

  if (text.includes('missing') || text.includes('unguarded') || text.includes('live')) {
    likelihood = Math.max(likelihood, RISK_MATRIX.likelihood.likely);
    reasoning.push('Condition wording indicates active uncontrolled exposure.');
  }

  if (
    classification === 'Powered Mobile Equipment' &&
    (text.includes('pedestrian') || text.includes('traffic'))
  ) {
    likelihood = Math.max(likelihood, RISK_MATRIX.likelihood.likely);
    reasoning.push('Mobile equipment operating near pedestrians increases struck-by exposure.');
  }

  if (
    classification === 'Housekeeping' &&
    (text.includes('spill') || text.includes('walkway') || text.includes('slip'))
  ) {
    severity = Math.max(severity, RISK_MATRIX.severity.serious);
    likelihood = Math.max(likelihood, RISK_MATRIX.likelihood.possible);
    reasoning.push('Walking-working surface condition creates slip/trip exposure.');
  }

  const matrixScore = severity * likelihood;
  const matrixBand = bandFromMatrixScore(matrixScore);

  let escalationScore = matrixScore;
  if (imminentDanger) escalationScore += 5;
  if (fatalityPotential === 'high') escalationScore += 3;
  if (classification === 'Powered Mobile Equipment' && text.includes('pedestrian')) escalationScore += 3;
  if (classification === 'Fall' && (text.includes('open edge') || text.includes('guardrail'))) escalationScore += 3;

  escalationScore = Math.min(25, escalationScore);
  const escalationBand = bandFromMatrixScore(escalationScore);

  const requiresShutdown =
    imminentDanger ||
    escalationBand === 'Critical' ||
    (escalationBand === 'High' && fatalityPotential === 'high');

  return {
    riskScore: escalationScore,
    riskBand: escalationBand,
    imminentDanger,
    fatalityPotential,
    requiresShutdown,
    reasoning,

    operationalRisk: {
      severity,
      likelihood,
      matrixScore,
      matrixBand,
    },

    aiRisk: {
      escalationScore,
      escalationBand,
      imminentDanger,
      fatalityPotential,
      requiresShutdown,
      escalationReasons: reasoning,
    },
  };
}
