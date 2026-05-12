import { StandardsBridgeService } from './standards-bridge.service';
import { Injectable } from '@nestjs/common';
import { DeterministicClassifier } from './engine/deterministic-classifier';
import { evaluateRisk } from './risk/risk-engine';
import { ActionEngineService } from '../action-engine/action-engine.service';
import { ContextExpansionService } from './context/context-expansion.service';
import { EvidenceFusionService } from './evidence/evidence-fusion.service';

@Injectable()
export class SafescopeV2Service {
  private classifier = new DeterministicClassifier();
  private bridge = new StandardsBridgeService();

  constructor(
    private readonly actionEngine: ActionEngineService,
    private readonly contextExpansion: ContextExpansionService,
    private readonly evidenceFusion: EvidenceFusionService,
  ) {}

  private async buildActionPreview(
    classification: string,
    text: string,
    risk: any,
    standards: any[],
    expandedContext?: any,
  ) {
    const generated = await this.actionEngine.generateActionsFromReport({
      id: `preview-${Date.now()}`,
      category: classification,
      description: text,
      riskScore: risk?.operationalRisk?.matrixScore || risk?.riskScore || 10,
      riskLevel: (risk?.riskBand || 'MODERATE').toUpperCase(),
      confidence: 0.9,
      patterns: [],
      location: 'Inspection Area',
      override: risk?.requiresShutdown || false,
      safeScope: {
        classification,
        riskBand: risk?.riskBand,
        requiresShutdown: risk?.requiresShutdown,
        imminentDanger: risk?.imminentDanger,
        fatalityPotential: risk?.fatalityPotential,
        reasoning: [
          ...(risk?.reasoning || []),
          ...(expandedContext?.reasoning || []),
        ],
        standards,
        expandedContext,
      },
    });

    return generated.map((action) => ({
      title: action.title,
      description: action.description,
      priority: action.priority,
      assignedRole: action.assignedRole,
      dueDate: action.dueDate,
      requiresShutdown: risk?.requiresShutdown || false,
      referenceStandards: standards.map((standard) => standard.citation),
      suggestedFixes: action.suggestedFixes || [],
      sourceHazard: classification,
    }));
  }

  async classify(text: string, scopes?: string[], evidenceTexts?: string[]) {
    const evidenceFusion = this.evidenceFusion.synthesize([
      text,
      ...(evidenceTexts || []),
    ]);

    const fusedText = evidenceFusion.combinedNarrative || text;

    const result = this.classifier.classify(fusedText);

    const primaryCandidate = {
      classification: result.classification,
      confidence: result.confidence,
      confidenceBand: result.confidenceBand,
      evidenceTokens: result.evidenceTokens,
      requiresHumanReview: result.requiresHumanReview,
      explanation: result.explanation,
      risk: evaluateRisk({
        text: fusedText,
        classification: result.classification,
        environment: 'warehouse',
      }),
    };

    const additionalCandidates = (result.additionalHazards || []).map((hazard) => ({
      ...hazard,
      risk: evaluateRisk({
        text: fusedText,
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

    const expandedContext = this.contextExpansion.expand(
      fusedText,
      promotedPrimary.classification,
      evidenceFusion.inferredThemes,
    );

    const primaryStandardsResult = this.bridge.getSuggestedStandards(
      promotedPrimary.classification,
      scopes,
    );

    const generatedActions = await this.buildActionPreview(
      promotedPrimary.classification,
      fusedText,
      promotedPrimary.risk,
      primaryStandardsResult.suggestedStandards,
      expandedContext,
    );

    const additionalHazards = await Promise.all(
      allCandidates
        .filter((hazard) => hazard.classification !== promotedPrimary.classification)
        .map(async (hazard) => {
          const standardsResult = this.bridge.getSuggestedStandards(
            hazard.classification,
            scopes,
          );

          const hazardExpandedContext = this.contextExpansion.expand(
            fusedText,
            hazard.classification,
            evidenceFusion.inferredThemes,
          );

          const hazardActions = await this.buildActionPreview(
            hazard.classification,
            fusedText,
            hazard.risk,
            standardsResult.suggestedStandards,
            hazardExpandedContext,
          );

          return {
            ...hazard,
            ...standardsResult,
            expandedContext: hazardExpandedContext,
            generatedActions: hazardActions,
          };
        }),
    );

    const promotionWarning =
      promotedPrimary.classification !== result.classification
        ? [
            `Primary hazard promoted from ${result.classification} to ${promotedPrimary.classification} based on operational risk.`,
          ]
        : [];

    return {
      classification: promotedPrimary.classification,
      confidence: promotedPrimary.confidence,
      confidenceBand: promotedPrimary.confidenceBand,
      evidenceTokens: promotedPrimary.evidenceTokens,
      ambiguityWarnings: [...result.ambiguityWarnings, ...promotionWarning],
      requiresHumanReview: result.requiresHumanReview || promotionWarning.length > 0,
      explanation: promotedPrimary.explanation,
      ...primaryStandardsResult,
      risk: promotedPrimary.risk,
      evidenceFusion,
      expandedContext,
      generatedActions,
      additionalHazards,
    };
  }
}
