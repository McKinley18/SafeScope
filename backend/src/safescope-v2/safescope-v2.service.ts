import { StandardsBridgeService } from './standards-bridge.service';
import { Injectable } from '@nestjs/common';
import { WeightedClassifierService } from './classifier/weighted-classifier.service';
import { evaluateRisk } from './risk/risk-engine';
import { ActionEngineService } from '../action-engine/action-engine.service';
import { ContextExpansionService } from './context/context-expansion.service';
import { EvidenceFusionService } from './evidence/evidence-fusion.service';
import { ApplicableStandardsService } from '../applicable-standards/applicable-standards.service';
import { ConfidenceIntelligenceService } from './confidence/confidence-intelligence.service';
import { SafeScopeFeedbackService } from './feedback/safescope-feedback.service';
import { TrendIntelligenceService } from './trend-intelligence/trend-intelligence.service';
import { OperationalReasoningService } from './reasoning/operational-reasoning.service';
import { ControlIntelligenceService } from './control-intelligence/control-intelligence.service';
import { DecisionExplainabilityService } from './explainability/decision-explainability.service';
import { EvidenceQualityService } from './evidence-quality/evidence-quality.service';
import { StandardsReasoningService } from './standards-reasoning/standards-reasoning.service';
import { CorrelationIntelligenceService } from './correlation-intelligence/correlation-intelligence.service';
import { EnergyTransferIntelligenceService } from './energy-intelligence/energy-transfer-intelligence.service';
import { BarrierIntelligenceService } from './barrier-intelligence/barrier-intelligence.service';
import { ActionEffectivenessService } from './action-effectiveness/action-effectiveness.service';
import { EventSequenceService } from './event-sequence/event-sequence.service';
import { OperationalStateService } from './operational-state/operational-state.service';
import { HumanFactorsService } from './human-factors/human-factors.service';

@Injectable()
export class SafescopeV2Service {
  private classifier = new WeightedClassifierService();
  private bridge = new StandardsBridgeService();
  private confidenceEngine = new ConfidenceIntelligenceService();
  private trendEngine = new TrendIntelligenceService();
  private reasoningEngine = new OperationalReasoningService();
  private controlEngine = new ControlIntelligenceService();
  private explainabilityEngine = new DecisionExplainabilityService();
  private evidenceQualityEngine = new EvidenceQualityService();
  private standardsReasoningEngine = new StandardsReasoningService();
  private correlationEngine = new CorrelationIntelligenceService();
  private energyEngine = new EnergyTransferIntelligenceService();
  private barrierEngine = new BarrierIntelligenceService();
  private actionEffectivenessEngine = new ActionEffectivenessService();
  private eventSequenceEngine = new EventSequenceService();
  private operationalStateEngine = new OperationalStateService();
  private humanFactorsEngine = new HumanFactorsService();

  constructor(
    private readonly actionEngine: ActionEngineService,
    private readonly contextExpansion: ContextExpansionService,
    private readonly evidenceFusion: EvidenceFusionService,
    private readonly applicableStandards: ApplicableStandardsService,
    private readonly feedbackService: SafeScopeFeedbackService,
  ) {}


  private scopeToSource(scopes?: string[]) {
    if (!scopes || scopes.length === 0 || scopes.includes('all')) return undefined;
    if (scopes.includes('msha')) return 'MSHA';
    if (scopes.includes('osha_construction')) return 'OSHA_CONSTRUCTION';
    if (scopes.includes('osha_general')) return 'OSHA_GENERAL_INDUSTRY';
    return undefined;
  }

  private async getMergedStandards(classification: string, text: string, scopes?: string[], workspaceId?: string) {
    const curated = this.bridge.getSuggestedStandards(classification, scopes);

    const cfrMatches = await this.applicableStandards.suggest(
      text,
      classification,
      this.scopeToSource(scopes),
      5,
    );

    const normalizedCurated = curated.suggestedStandards.map((standard: any) => ({
      ...standard,
      source: 'curated',
      score: 100,
      matchingReasons: [standard.rationale || 'Curated SafeScope mapping'],
    }));

    const normalizedCfr = cfrMatches.map((standard: any) => ({
      citation: standard.citation,
      agency: standard.agencyCode,
      scope: standard.scopeCode,
      rationale: standard.summary || standard.heading || 'CFR database match',
      source: 'cfr_database',
      score: standard.score,
      confidence: standard.confidence,
      matchingReasons: standard.matchingReasons || [],
    }));

    const merged = [...normalizedCurated, ...normalizedCfr];
    const byCitation = new Map<string, any>();

    for (const standard of merged) {
      const existing = byCitation.get(standard.citation);

      if (!existing) {
        byCitation.set(standard.citation, {
          ...standard,
          source: [standard.source],
          matchingReasons: standard.matchingReasons || [],
        });
        continue;
      }

      byCitation.set(standard.citation, {
        ...existing,
        ...standard,
        source: Array.from(new Set([...(existing.source || []), standard.source])),
        score: Math.max(existing.score || 0, standard.score || 0),
        confidence: Math.max(existing.confidence || 0, standard.confidence || 0),
        matchingReasons: Array.from(
          new Set([
            ...(existing.matchingReasons || []),
            ...(standard.matchingReasons || []),
          ]),
        ),
      });
    }

    const adjustments = await this.feedbackService.getWorkspaceStandardAdjustments(workspaceId);
    const adjustmentMap = new Map(adjustments.map((item: any) => [item.citation, item]));

    const unique = Array.from(byCitation.values()).map((standard: any) => {
      const adjustment = adjustmentMap.get(standard.citation);

      if (!adjustment) {
        return {
          ...standard,
          workspaceLearningAdjustment: 0,
          workspaceLearningWarnings: [],
        };
      }

      return {
        ...standard,
        score: Math.max(0, (standard.score || 0) + adjustment.adjustment),
        workspaceLearningAdjustment: adjustment.adjustment,
        workspaceLearningWarnings: adjustment.warnings || [],
      };
    });

    return {
      suggestedStandards: unique.sort((a: any, b: any) => (b.score || 0) - (a.score || 0)).slice(0, 8),
      excludedStandards: curated.excludedStandards,
    };
  }

  private async buildActionPreview(
    classification: string,
    text: string,
    risk: any,
    standards: any[],
    expandedContext?: any,
  ) {
    const generated = await this.actionEngine.generateActionsFromReport({
      id: `preview-${Date.now()}`,
      category: classification === 'Machine Guarding' ? 'machine' : classification,
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

  async classify(text: string, scopes?: string[], evidenceTexts?: string[], riskProfileId?: 'simple_4x4' | 'standard_5x5' | 'advanced_6x6', workspaceId?: string) {
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
      commonConsequences: result.commonConsequences || [],
      requiredControls: result.requiredControls || [],
      score: result.score,
      scoreMargin: result.scoreMargin,
      excludedHazards: result.excludedHazards || [],
      risk: evaluateRisk({
        text: fusedText,
        classification: result.classification,
        environment: 'warehouse',
        riskProfileId,
      }),
    };

    const additionalCandidates = (result.additionalHazards || []).map((hazard) => ({
      ...hazard,
      risk: evaluateRisk({
        text: fusedText,
        classification: hazard.classification,
        environment: 'warehouse',
        riskProfileId,
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

    const promotedPrimary: any = [...allCandidates].sort((a: any, b: any) => {
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

    const primaryStandardsResult = await this.getMergedStandards(
      promotedPrimary.classification,
      fusedText,
      scopes,
      workspaceId,
    );

    const confidenceIntelligence = this.confidenceEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      classifierConfidence: promotedPrimary.confidence,
      evidenceTexts,
      evidenceTokens: promotedPrimary.evidenceTokens,
      ambiguityWarnings: [...result.ambiguityWarnings],
      expandedContext,
      suggestedStandards: primaryStandardsResult.suggestedStandards,
      photosAttached: (evidenceTexts || []).some((item) =>
        String(item).toLowerCase().includes('photo')
      ),
    });

    const operationalReasoning = this.reasoningEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      expandedContext,
      risk: promotedPrimary.risk,
    });

    const trendIntelligence = this.trendEngine.evaluate({
      classification: promotedPrimary.classification,
      location: (expandedContext as any)?.location || undefined,
      riskScore: promotedPrimary.risk?.riskScore,
      priorFindings: arguments[5] as any[],
    });

    const generatedActions = await this.buildActionPreview(
      promotedPrimary.classification,
      fusedText,
      promotedPrimary.risk,
      primaryStandardsResult.suggestedStandards,
      expandedContext,
    );

    const energyTransferIntelligence = this.energyEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      operationalReasoning,
      risk: promotedPrimary.risk,
    });

    const evidenceQuality = this.evidenceQualityEngine.evaluate({
      text: fusedText,
      evidenceTexts,
      photosAttached: (evidenceTexts || []).some((item) =>
        String(item).toLowerCase().includes('photo')
      ),
      operationalReasoning,
      confidenceIntelligence,
    });

    const controlIntelligence = this.controlEngine.evaluate({
      classification: promotedPrimary.classification,
      risk: promotedPrimary.risk,
      generatedActions,
      suggestedStandards: primaryStandardsResult.suggestedStandards,
      trendIntelligence,
      operationalReasoning,
    });

    const barrierIntelligence = this.barrierEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      energyTransferIntelligence,
      controlIntelligence,
      operationalReasoning,
    });

    const eventSequence = this.eventSequenceEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      operationalReasoning,
      energyTransferIntelligence,
      barrierIntelligence,
    });

    const operationalState = this.operationalStateEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      eventSequence,
      energyTransferIntelligence,
    });

    const humanFactors = this.humanFactorsEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      operationalState,
      eventSequence,
      energyTransferIntelligence,
    });

    const actionEffectiveness = this.actionEffectivenessEngine.evaluate({
      generatedActions,
      operationalReasoning,
      energyTransferIntelligence,
      barrierIntelligence,
      controlIntelligence,
    });

    const standardsReasoning = this.standardsReasoningEngine.evaluate({
      classification: promotedPrimary.classification,
      standards: primaryStandardsResult.suggestedStandards,
      operationalReasoning,
      expandedContext,
      risk: promotedPrimary.risk,
    });

    const decisionExplainability = this.explainabilityEngine.evaluate({
      classification: promotedPrimary.classification,
      confidenceIntelligence,
      risk: promotedPrimary.risk,
      suggestedStandards: primaryStandardsResult.suggestedStandards,
      operationalReasoning,
      trendIntelligence,
      controlIntelligence,
    });

    const additionalHazards = await Promise.all(
      allCandidates
        .filter((hazard) => hazard.classification !== promotedPrimary.classification)
        .map(async (hazard) => {
          const standardsResult = await this.getMergedStandards(
            hazard.classification,
            fusedText,
            scopes,
            workspaceId,
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

    const correlationIntelligence = this.correlationEngine.evaluate({
      classification: promotedPrimary.classification,
      additionalHazards,
      trendIntelligence,
      controlIntelligence,
      operationalReasoning,
      priorFindings: arguments[5] as any[],
    });

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
      commonConsequences: promotedPrimary.commonConsequences || [],
      requiredControls: promotedPrimary.requiredControls || [],
      score: promotedPrimary.score,
      scoreMargin: promotedPrimary.scoreMargin,
      excludedHazards: promotedPrimary.excludedHazards || result.excludedHazards || [],
      ...primaryStandardsResult,
      risk: promotedPrimary.risk,
      evidenceFusion,
      expandedContext,
      confidenceIntelligence,
      generatedActions,
      additionalHazards,
    };
  }
}
