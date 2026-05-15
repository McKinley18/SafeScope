import { Injectable } from '@nestjs/common';
import { SafeScopeReasoningSnapshot } from './reasoning-snapshot.entity';

@Injectable()
export class ReasoningSnapshotService {
  buildSnapshot(input: {
    reportId?: string;
    workspaceId?: string;
    classification?: string;
    intelligence?: any;
  }): Partial<SafeScopeReasoningSnapshot> {
    const intelligence = input.intelligence || {};

    return {
      reportId: input.reportId,
      workspaceId: input.workspaceId,
      classification: input.classification,
      engineVersion: intelligence.intelligenceMetadata?.engineVersion,
      intelligenceMetadata: intelligence.intelligenceMetadata,
      confidenceCalibration: intelligence.confidenceCalibration,
      reasoningDrift: intelligence.reasoningDrift,
      workspaceLearning: intelligence.workspaceLearning,
      operationalReasoning: intelligence.operationalReasoning,
      standardsReasoning: intelligence.standardsReasoning,
      decisionExplainability: intelligence.decisionExplainability,
      fullIntelligenceSnapshot: intelligence,
      validationStatus:
        intelligence.reasoningDrift?.driftBand === 'high' ||
        intelligence.confidenceCalibration?.calibrationBand === 'limited_reliability'
          ? 'requires_review'
          : 'generated',
    };
  }
}
