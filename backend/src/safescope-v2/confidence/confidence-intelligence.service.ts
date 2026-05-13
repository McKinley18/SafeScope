export type ConfidenceBand = 'low' | 'medium' | 'high';

export type ConfidenceIntelligence = {
  overallConfidence: number;
  confidenceBand: ConfidenceBand;
  strengths: string[];
  missingCriticalInformation: string[];
  conflictingSignals: string[];
  recommendedFollowup: string[];
};

function band(score: number): ConfidenceBand {
  if (score >= 0.8) return 'high';
  if (score >= 0.55) return 'medium';
  return 'low';
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export class ConfidenceIntelligenceService {
  evaluate(input: {
    text: string;
    classification: string;
    classifierConfidence?: number;
    evidenceTexts?: string[];
    evidenceTokens?: string[];
    ambiguityWarnings?: string[];
    expandedContext?: any;
    suggestedStandards?: any[];
    photosAttached?: boolean;
  }): ConfidenceIntelligence {
    const text = (input.text || '').toLowerCase();
    const strengths: string[] = [];
    const missingCriticalInformation: string[] = [];
    const conflictingSignals: string[] = [];
    const recommendedFollowup: string[] = [];

    let score = input.classifierConfidence ?? 0.5;

    if ((input.evidenceTokens || []).length >= 3) {
      score += 0.06;
      strengths.push('Multiple direct hazard signals were detected.');
    }

    if ((input.suggestedStandards || []).length > 0) {
      score += 0.06;
      strengths.push('Applicable standards were identified.');
    }

    if ((input.suggestedStandards || []).some((s) => Array.isArray(s.source) && s.source.includes('curated') && s.source.includes('cfr_database'))) {
      score += 0.08;
      strengths.push('At least one standard was supported by both curated mapping and CFR database matching.');
    }

    if ((input.evidenceTexts || []).some(Boolean)) {
      score += 0.04;
      strengths.push('Evidence notes were included.');
    }

    if (input.photosAttached) {
      score += 0.04;
      strengths.push('Photo evidence was attached.');
    }

    if ((input.ambiguityWarnings || []).length > 0) {
      score -= 0.12;
      conflictingSignals.push(...(input.ambiguityWarnings || []));
    }

    const contextBand = input.expandedContext?.contextConfidence?.band;
    if (contextBand === 'low') {
      score -= 0.08;
      missingCriticalInformation.push('Context details are limited.');
    }

    if (!includesAny(text, ['employee', 'worker', 'operator', 'pedestrian', 'person', 'persons'])) {
      score -= 0.04;
      missingCriticalInformation.push('Employee exposure is not clearly described.');
    }

    if (!includesAny(text, ['near', 'within reach', 'contact', 'exposed', 'working', 'operating', 'using'])) {
      score -= 0.04;
      missingCriticalInformation.push('Exposure distance or interaction with the hazard is unclear.');
    }

    if (!includesAny(text, ['location', 'area', 'shop', 'plant', 'pit', 'walkway', 'platform', 'conveyor', 'panel', 'tank'])) {
      score -= 0.03;
      missingCriticalInformation.push('Specific location or equipment context is limited.');
    }

    if (
      ['Machine Guarding', 'Lockout / Stored Energy', 'Electrical'].includes(input.classification) &&
      !includesAny(text, ['locked out', 'lockout', 'de-energized', 'energized', 'running', 'operating', 'shut down'])
    ) {
      score -= 0.06;
      missingCriticalInformation.push('Energy state is not clearly documented.');
      recommendedFollowup.push('Confirm whether the equipment was operating, shut down, de-energized, or locked out.');
    }

    if (
      input.classification === 'Fall Protection' &&
      !includesAny(text, ['height', 'feet', 'elevated', 'platform', 'edge', 'guardrail'])
    ) {
      score -= 0.05;
      missingCriticalInformation.push('Fall height or edge condition is not clearly documented.');
      recommendedFollowup.push('Document approximate height and whether guardrails, covers, or fall protection were present.');
    }

    if (
      input.classification === 'Confined Space' &&
      !includesAny(text, ['atmospheric testing', 'attendant', 'permit', 'rescue', 'ventilation'])
    ) {
      score -= 0.08;
      missingCriticalInformation.push('Critical confined space controls are not documented.');
      recommendedFollowup.push('Confirm permit status, atmospheric testing, attendant, ventilation, and rescue provisions.');
    }

    if (missingCriticalInformation.length > 0) {
      recommendedFollowup.push('Add missing context before relying on final standard selection.');
    }

    if (missingCriticalInformation.length >= 2) {
      score = Math.min(score, 0.88);
    } else if (missingCriticalInformation.length === 1) {
      score = Math.min(score, 0.93);
    }

    if (conflictingSignals.length > 0) {
      score = Math.min(score, 0.82);
    }

    score = Math.max(0, Math.min(0.99, Number(score.toFixed(2))));

    return {
      overallConfidence: score,
      confidenceBand: band(score),
      strengths: Array.from(new Set(strengths)),
      missingCriticalInformation: Array.from(new Set(missingCriticalInformation)),
      conflictingSignals: Array.from(new Set(conflictingSignals)),
      recommendedFollowup: Array.from(new Set(recommendedFollowup)),
    };
  }
}
