import { Injectable } from '@nestjs/common';
import { HAZARD_FAMILIES } from './data/hazard-conditions';

@Injectable()
export class MatchEngineService {
  match(desc: string, category: string, mode: string) {
    const descNormal = desc.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    
    // Stage 1: Family Detection
    let bestFamily = { id: 'other_uncertain', score: 0 };
    for (const [id, config] of Object.entries(HAZARD_FAMILIES)) {
      let score = 0;
      config.keywords.forEach(k => { if (descNormal.includes(k)) score += 50; });
      if (score > bestFamily.score) bestFamily = { id, score };
    }

    if (bestFamily.score < 30) return { primaryConditionId: "other_uncertain", confidence: 0 };

    // Stage 2: Subtype Detection (within Family)
    const familyConfig = HAZARD_FAMILIES[bestFamily.id];
    let bestSubtype = { id: familyConfig.conditions[0], score: 0 };
    familyConfig.conditions.forEach(cond => {
        let subScore = 0;
        if (descNormal.includes(cond.replace('_', ' '))) subScore += 100;
        if (subScore > bestSubtype.score) bestSubtype = { id: cond, score: subScore };
    });

    return {
        primaryConditionId: bestSubtype.id,
        parentConditionId: bestFamily.id,
        confidence: bestFamily.score + bestSubtype.score,
        needsReview: bestSubtype.score < 50
    };
  }
}
