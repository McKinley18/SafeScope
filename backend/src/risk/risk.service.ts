import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskScore } from './entities/risk-score.entity';
import { Classification } from '../classifications/entities/classification.entity';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(RiskScore) private riskRepo: Repository<RiskScore>,
    @InjectRepository(Classification) private classificationRepo: Repository<Classification>,
  ) {}

  async calculateRisk(classificationId: string) {
    const classification = await this.classificationRepo.findOne({ where: { id: classificationId } });
    if (!classification) throw new Error('Classification not found');

    const severity = classification.severityLevel || 1;
    const compositeRiskScore = severity * (classification.confidenceScore * 10);
    
    let riskBand: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (compositeRiskScore > 20) riskBand = 'critical';
    else if (compositeRiskScore > 10) riskBand = 'high';
    else if (compositeRiskScore > 5) riskBand = 'medium';

    const riskScore = this.riskRepo.create({
      classificationId,
      reportId: classification.reportId,
      severityScore: severity,
      recurrenceScore: 1,
      trendScore: 0,
      controlFailureScore: 0,
      confidenceModifier: classification.confidenceScore,
      compositeRiskScore,
      riskBand,
    });

    return this.riskRepo.save(riskScore);
  }
}
