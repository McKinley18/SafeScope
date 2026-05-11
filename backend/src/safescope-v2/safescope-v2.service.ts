import { StandardsBridgeService } from './standards-bridge.service';
import { Injectable } from '@nestjs/common';
import { DeterministicClassifier } from './engine/deterministic-classifier';
import { evaluateRisk } from './risk/risk-engine';

@Injectable()
export class SafescopeV2Service {
  private classifier = new DeterministicClassifier();
  private bridge = new StandardsBridgeService();

  classify(text: string, scopes?: string[]) {
    const result = this.classifier.classify(text);
    const primaryCandidate = {
      classification: result.classification,
      confidence: result.confidence,
      confidenceBand: result.confidenceBand,
      evidenceTokens: result.evidenceTokens,
      requiresHumanReview: result.requiresHumanReview,
      explanation: result.explanation,
      risk: evaluateRisk({
        text,
        classification: result.classification,
        environment: 'warehouse',
      }),
    };

    const additionalCandidates = (result.additionalHazards || []).map((hazard) => ({
      ...hazard,
      risk: evaluateRisk({
        text,
        classification: hazard.classification,
        environment: 'warehouse',
      }),
    }));

    const allCandidates = [primaryCandidate, ...additionalCandidates];

    const severityPriority: Record<string, number> = {
      Fall: 100,
      'Powered Mobile Equipment': 95,
      Electrical: 90,
      Machine: 85,
      'Hazard Communication': 70,
      Housekeeping: 50,
      PPE: 40,
      'Review Required': 0,
    };

    const promotedPrimary = [...allCandidates].sort((a, b) => {
      const scoreDelta = (b.risk?.riskScore || 0) - (a.risk?.riskScore || 0);
      if (scoreDelta !== 0) return scoreDelta;

      const priorityDelta =
        (severityPriority[b.classification] || 0) -
        (severityPriority[a.classification] || 0);
      if (priorityDelta !== 0) return priorityDelta;

      return (b.confidence || 0) - (a.confidence || 0);
    })[0];

    const additionalHazards = allCandidates
      .filter((hazard) => hazard.classification !== promotedPrimary.classification)
      .map((hazard) => ({
        ...hazard,
        ...this.bridge.getSuggestedStandards(hazard.classification, scopes),
      }));

    const promotionWarning =
      promotedPrimary.classification !== result.classification
        ? [`Primary hazard promoted from ${result.classification} to ${promotedPrimary.classification} based on operational risk.`]
        : [];

    return {
      classification: promotedPrimary.classification,
      confidence: promotedPrimary.confidence,
      confidenceBand: promotedPrimary.confidenceBand,
      evidenceTokens: promotedPrimary.evidenceTokens,
      ambiguityWarnings: [...result.ambiguityWarnings, ...promotionWarning],
      requiresHumanReview:
        result.requiresHumanReview || promotionWarning.length > 0,
      explanation: promotedPrimary.explanation,
      ...this.bridge.getSuggestedStandards(promotedPrimary.classification, scopes),
      risk: promotedPrimary.risk,
      additionalHazards,
    };
  }
}
