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
    const risk = evaluateRisk({
      text,
      classification: result.classification,
      environment: 'warehouse',
    });

    return {
      classification: result.classification,
      confidence: result.confidence,
      confidenceBand: result.confidenceBand,
      evidenceTokens: result.evidenceTokens,
      ambiguityWarnings: result.ambiguityWarnings,
      requiresHumanReview: result.requiresHumanReview,
      explanation: result.explanation,
      ...this.bridge.getSuggestedStandards(result.classification, scopes),
      risk,
    };
  }
}
