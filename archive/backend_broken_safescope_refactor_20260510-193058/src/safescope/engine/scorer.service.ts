import { Standard } from '../standards/standard.entity';

export class ScorerService {

  score(input: any, standard: Standard): number {
    let score = 0;

    if (standard.hazardTags.includes(input.hazardType)) score += 5;

    const keywordMatches = standard.keywordTriggers.filter(k =>
      input.keywords.includes(k)
    );

    score += keywordMatches.length * 2;

    if (standard.equipmentTags?.includes(input.equipment)) score += 2;

    if (standard.environmentTags?.includes(input.environment)) score += 1;

    if (standard.severityWeight?.includes(input.calculatedRisk)) score += 1;

    return score;
  }
}
