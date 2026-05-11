import { RISK_MATRIX } from './risk-matrix.seed';

export type RiskInput = {
  text: string;
  classification: string;
  environment?: keyof typeof RISK_MATRIX.environmentMultiplier;
};

export type RiskResult = {
  riskScore: number;
  riskBand: 'Low' | 'Moderate' | 'High' | 'Critical';
  imminentDanger: boolean;
  fatalityPotential: 'low' | 'medium' | 'high';
  requiresShutdown: boolean;
  reasoning: string[];
};

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

export function evaluateRisk(input: RiskInput): RiskResult {
  const text = normalize(input.text || '');
  const classification = input.classification || 'Review Required';
  const environment = input.environment || 'warehouse';

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

  const environmentMultiplier =
    RISK_MATRIX.environmentMultiplier[environment] ||
    RISK_MATRIX.environmentMultiplier.warehouse;

  const rawScore = severity * likelihood * environmentMultiplier;
  const riskScore = Math.round(rawScore);

  const riskBand =
    riskScore >= 24
      ? 'Critical'
      : riskScore >= 16
        ? 'High'
        : riskScore >= 8
          ? 'Moderate'
          : 'Low';

  const requiresShutdown =
    imminentDanger || riskBand === 'Critical' || (riskBand === 'High' && fatalityPotential === 'high');

  return {
    riskScore,
    riskBand,
    imminentDanger,
    fatalityPotential,
    requiresShutdown,
    reasoning,
  };
}
