import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafeScopeReasoningSnapshot } from './reasoning-snapshot.entity';

@Injectable()
export class ReasoningSnapshotService {
  constructor(
    @InjectRepository(SafeScopeReasoningSnapshot)
    private readonly snapshotRepo: Repository<SafeScopeReasoningSnapshot>,
  ) {}

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

  async findOne(id: string) {
    return this.snapshotRepo.findOne({ where: { id } });
  }

  async createSnapshot(input: {
    reportId?: string;
    workspaceId?: string;
    classification?: string;
    intelligence?: any;
  }) {
    const snapshot = this.snapshotRepo.create(this.buildSnapshot(input));
    return this.snapshotRepo.save(snapshot);
  }
}
