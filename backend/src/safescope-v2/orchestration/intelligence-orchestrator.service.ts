import { ConfidenceIntelligenceService } from '../confidence/confidence-intelligence.service';
import { TrendIntelligenceService } from '../trend-intelligence/trend-intelligence.service';
import { OperationalReasoningService } from '../reasoning/operational-reasoning.service';
import { ControlIntelligenceService } from '../control-intelligence/control-intelligence.service';
import { DecisionExplainabilityService } from '../explainability/decision-explainability.service';
import { EvidenceQualityService } from '../evidence-quality/evidence-quality.service';
import { StandardsReasoningService } from '../standards-reasoning/standards-reasoning.service';
import { CorrelationIntelligenceService } from '../correlation-intelligence/correlation-intelligence.service';
import { EnergyTransferIntelligenceService } from '../energy-intelligence/energy-transfer-intelligence.service';
import { BarrierIntelligenceService } from '../barrier-intelligence/barrier-intelligence.service';
import { ActionEffectivenessService } from '../action-effectiveness/action-effectiveness.service';
import { EventSequenceService } from '../event-sequence/event-sequence.service';
import { OperationalStateService } from '../operational-state/operational-state.service';
import { HumanFactorsService } from '../human-factors/human-factors.service';
import { ContradictionIntelligenceService } from '../contradiction-intelligence/contradiction-intelligence.service';
import { CounterfactualIntelligenceService } from '../counterfactual-intelligence/counterfactual-intelligence.service';
import { SiteMemoryService } from '../site-memory/site-memory.service';
import { HazardGraphService } from '../hazard-graph/hazard-graph.service';
import { ExposurePathService } from '../exposure-path/exposure-path.service';
import { ConfidenceCalibrationService } from '../validation/confidence-calibration.service';
import { ReasoningDriftService } from '../validation/reasoning-drift.service';
import { WorkspaceLearningService } from '../learning/workspace-learning.service';
import { ConfinedSpaceIntelligenceService } from '../reference-intelligence/confined-space/confined-space-intelligence.service';
import { LotoIntelligenceService } from '../reference-intelligence/loto/loto-intelligence.service';
import { MobileEquipmentIntelligenceService } from '../reference-intelligence/mobile-equipment/mobile-equipment-intelligence.service';
import { TrenchingIntelligenceService } from '../reference-intelligence/trenching/trenching-intelligence.service';
import { ElectricalIntelligenceService } from '../reference-intelligence/electrical/electrical-intelligence.service';
import { LiftingRiggingIntelligenceService } from '../reference-intelligence/lifting-rigging/lifting-rigging-intelligence.service';
import { HazcomGhsIntelligenceService } from '../reference-intelligence/hazcom-ghs/hazcom-ghs-intelligence.service';
import { CrossDomainInteractionService } from '../reference-intelligence/cross-domain/cross-domain-interaction.service';

export type SafeScopeIntelligenceOrchestratorInput = {
  fusedText: string;
  promotedPrimary: any;
  classifierResult: any;
  evidenceTexts?: string[];
  expandedContext: any;
  primaryStandardsResult: any;
  generatedActions: any[];
  additionalHazards: any[];
  priorFindings?: any[];
  workspaceId?: string;
  standardsFeedback?: any[];
  correctiveActionOutcomes?: any[];
};

export class SafeScopeIntelligenceOrchestrator {
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
  private contradictionEngine = new ContradictionIntelligenceService();
  private counterfactualEngine = new CounterfactualIntelligenceService();
  private siteMemoryEngine = new SiteMemoryService();
  private hazardGraphEngine = new HazardGraphService();
  private exposurePathEngine = new ExposurePathService();
  private confidenceCalibrationEngine = new ConfidenceCalibrationService();
  private reasoningDriftEngine = new ReasoningDriftService();
  private workspaceLearningEngine = new WorkspaceLearningService();
  private confinedSpaceEngine = new ConfinedSpaceIntelligenceService();
  private lotoEngine = new LotoIntelligenceService();
  private mobileEquipmentEngine = new MobileEquipmentIntelligenceService();
  private trenchingEngine = new TrenchingIntelligenceService();
  private electricalEngine = new ElectricalIntelligenceService();
  private liftingRiggingEngine = new LiftingRiggingIntelligenceService();
  private hazcomGhsEngine = new HazcomGhsIntelligenceService();
  private crossDomainEngine = new CrossDomainInteractionService();

  evaluate(input: SafeScopeIntelligenceOrchestratorInput) {
    const {
      fusedText,
      promotedPrimary,
      classifierResult,
      evidenceTexts,
      expandedContext,
      primaryStandardsResult,
      generatedActions,
      additionalHazards,
      priorFindings,
      workspaceId,
      standardsFeedback,
      correctiveActionOutcomes,
    } = input;

    const photosAttached = (evidenceTexts || []).some((item) =>
      String(item).toLowerCase().includes('photo')
    );

    const confidenceIntelligence = this.confidenceEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      classifierConfidence: promotedPrimary.confidence,
      evidenceTexts,
      evidenceTokens: promotedPrimary.evidenceTokens,
      ambiguityWarnings: [...(classifierResult.ambiguityWarnings || [])],
      expandedContext,
      suggestedStandards: primaryStandardsResult.suggestedStandards,
      photosAttached,
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
      priorFindings,
    });

    const energyTransferIntelligence = this.energyEngine.evaluate({
      text: fusedText,
      classification: promotedPrimary.classification,
      operationalReasoning,
      risk: promotedPrimary.risk,
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

    const contradictionIntelligence = this.contradictionEngine.evaluate({
      text: fusedText,
      operationalState,
      energyTransferIntelligence,
      barrierIntelligence,
      humanFactors,
    });

    const actionEffectiveness = this.actionEffectivenessEngine.evaluate({
      generatedActions,
      operationalReasoning,
      energyTransferIntelligence,
      barrierIntelligence,
      controlIntelligence,
    });

    const counterfactualIntelligence = this.counterfactualEngine.evaluate({
      classification: promotedPrimary.classification,
      operationalReasoning,
      energyTransferIntelligence,
      barrierIntelligence,
      controlIntelligence,
      actionEffectiveness,
    });

    const standardsReasoning = this.standardsReasoningEngine.evaluate({
      classification: promotedPrimary.classification,
      standards: primaryStandardsResult.suggestedStandards,
      operationalReasoning,
      expandedContext,
      risk: promotedPrimary.risk,
    });

    const hazardGraph = this.hazardGraphEngine.evaluate({
      classification: promotedPrimary.classification,
      additionalHazards,
      energyTransferIntelligence,
      humanFactors,
      operationalState,
      barrierIntelligence,
    });

    const exposurePathIntelligence = this.exposurePathEngine.evaluate({
      classification: promotedPrimary.classification,
      text: fusedText,
      operationalState,
      energyTransferIntelligence,
      humanFactors,
    });

    const correlationIntelligence = this.correlationEngine.evaluate({
      classification: promotedPrimary.classification,
      additionalHazards,
      trendIntelligence,
      controlIntelligence,
      operationalReasoning,
      priorFindings,
    });

    const siteMemory = this.siteMemoryEngine.evaluate({
      currentClassification: promotedPrimary.classification,
      currentLocation: (expandedContext as any)?.area || (expandedContext as any)?.location,
      priorFindings,
      trendIntelligence,
      correlationIntelligence,
    });

    const evidenceQuality = this.evidenceQualityEngine.evaluate({
      text: fusedText,
      evidenceTexts,
      photosAttached,
      operationalReasoning,
      confidenceIntelligence,
    });

    const domainIntelligence = {
      confinedSpace: this.confinedSpaceEngine.evaluate({
        text: fusedText,
        classification: promotedPrimary.classification,
      }),
      loto: this.lotoEngine.evaluate({
        text: fusedText,
        classification: promotedPrimary.classification,
      }),
      mobileEquipment: this.mobileEquipmentEngine.evaluate({
        text: fusedText,
        classification: promotedPrimary.classification,
      }),
      trenching: this.trenchingEngine.evaluate({
        text: fusedText,
        classification: promotedPrimary.classification,
      }),
      electrical: this.electricalEngine.evaluate({
        text: fusedText,
        classification: promotedPrimary.classification,
      }),
      liftingRigging: this.liftingRiggingEngine.evaluate({
        text: fusedText,
        classification: promotedPrimary.classification,
      }),
      hazcomGhs: this.hazcomGhsEngine.evaluate({
        text: fusedText,
        classification: promotedPrimary.classification,
      }),
    };

    const crossDomainInteraction = this.crossDomainEngine.evaluate({
      domainIntelligence,
    });

    const workspaceLearning = this.workspaceLearningEngine.evaluate({
      workspaceId,
      classification: promotedPrimary.classification,
      priorFindings,
      standardsFeedback,
      correctiveActionOutcomes,
    });

    const confidenceCalibration = this.confidenceCalibrationEngine.evaluate({
      classification: promotedPrimary.classification,
      confidenceIntelligence,
      contradictionIntelligence,
      evidenceQuality,
      standardsReasoning,
      actionEffectiveness,
    });

    const reasoningDrift = this.reasoningDriftEngine.evaluate({
      classification: promotedPrimary.classification,
      confidenceCalibration,
      contradictionIntelligence,
      standardsReasoning,
      operationalReasoning,
      priorFindings,
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

    return {
      intelligenceMetadata: {
        engineName: 'SafeScope Intelligence Orchestrator',
        engineVersion: '0.1.0',
        generatedAt: new Date().toISOString(),
        layersExecuted: [
          'confidence',
          'operational_reasoning',
          'trend',
          'energy_transfer',
          'evidence_quality',
          'control',
          'barrier',
          'event_sequence',
          'operational_state',
          'human_factors',
          'contradiction_detection',
          'action_effectiveness',
          'counterfactual',
          'standards_reasoning',
          'decision_explainability',
          'hazard_graph',
          'exposure_path',
          'correlation',
          'site_memory',
          'confidence_calibration',
          'reasoning_drift',
          'workspace_learning',
          'domain_intelligence',
          'cross_domain_interaction',
        ],
      },
      domainIntelligence,
      crossDomainInteraction,
      workspaceLearning,
      confidenceIntelligence,
      operationalReasoning,
      trendIntelligence,
      energyTransferIntelligence,
      evidenceQuality,
      controlIntelligence,
      barrierIntelligence,
      eventSequence,
      operationalState,
      humanFactors,
      contradictionIntelligence,
      actionEffectiveness,
      counterfactualIntelligence,
      standardsReasoning,
      decisionExplainability,
      hazardGraph,
      exposurePathIntelligence,
      correlationIntelligence,
      siteMemory,
      confidenceCalibration,
      reasoningDrift,
    };
  }
}
