import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, Raw } from 'typeorm';
import { Standard } from './entities/standard.entity';
import { CorrectiveActionTemplate } from './entities/corrective-action-template.entity';
import { standardSeeds } from './seeds/standards.seed';
import { hazardScenarioSeeds } from './seeds/hazard-scenarios.seed';

@Injectable()
export class StandardsService {
  constructor(
    @InjectRepository(Standard)
    private standardRepo: Repository<Standard>,
    @InjectRepository(CorrectiveActionTemplate)
    private correctiveTemplateRepo: Repository<CorrectiveActionTemplate>,
  ) {}

  private async ensureStandardsLibraryCurrent() {
    return;
  }

  async search(query?: string, source?: string) {
    await this.ensureStandardsLibraryCurrent();

    const safeSource = source === 'MSHA' || source === 'OSHA' ? source : undefined;
    const where: any = {};

    if (safeSource) where.source = safeSource;

    if (query) {
      where.heading = ILike(`%${query}%`);
    }

    return this.standardRepo.find({
      where,
      take: 25,
      order: { citation: 'ASC' },
    });
  }

  async suggest(description: string, source?: string, hazardCategory?: string) {
    await this.ensureStandardsLibraryCurrent();

    const standardsCount = await this.standardRepo.count();

    if (standardsCount === 0) {
      console.error('CRITICAL: Standards database is empty. Run npm run seed.');
      return [];
    }

    const safeSource = source === 'MSHA' || source === 'OSHA' ? source : undefined;

    const synonymMap: Record<string, string[]> = {
      conveyer: ['conveyor'],
      gard: ['guard', 'guarding'],
      latter: ['ladder'],
      ext: ['extinguisher'],
      extingusher: ['extinguisher'],
      seatbelt: ['seat belt'],
      backalarm: ['backup alarm'],
      beeper: ['backup alarm'],
      wireing: ['wiring', 'wire'],
      eletrical: ['electrical'],
      ppe: ['gloves', 'hard hat', 'eye protection', 'face shield'],
      bermm: ['berm'],
      triping: ['trip'],
      slipping: ['slip'],
      busted: ['broken', 'damaged'],
    };

    const rawWords = description
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);

    const words = Array.from(
      new Set(
        rawWords.flatMap((word) => [word, ...(synonymMap[word] || [])])
      )
    ).slice(0, 25);

    const categoryTerms: Record<string, string[]> = {
      'access / ladders / platforms': ['access', 'ladder', 'stairs', 'platform', 'handrail', 'grating', 'walkway', 'travelway'],
      'guarding / moving parts': ['guard', 'guarding', 'moving parts', 'conveyor', 'pulley', 'belt', 'roller', 'shaft'],
      electrical: ['electrical', 'wire', 'cord', 'conductor', 'panel', 'junction box', 'energized', 'breaker'],
      'housekeeping / slips / trips': ['housekeeping', 'slip', 'trip', 'spill', 'oil', 'debris', 'clutter', 'walkway'],
      'mobile equipment / traffic': ['mobile equipment', 'haul truck', 'loader', 'seat belt', 'backup alarm', 'horn', 'berm', 'traffic'],
      'fire / hot work / fuel': ['fire', 'extinguisher', 'hot work', 'welding', 'torch', 'fuel', 'flammable'],
      ppe: ['ppe', 'gloves', 'hard hat', 'eye protection', 'face shield', 'boots'],
      'dust / respiratory / noise': ['dust', 'silica', 'respirator', 'noise', 'hearing', 'ventilation'],
      'fall protection': ['fall protection', 'fall hazard', 'harness', 'lanyard', 'open edge', 'elevated'],
      'lockout / energy isolation': ['lockout', 'tagout', 'energy isolation', 'deenergize', 'energized', 'maintenance'],
      'emergency / first aid': ['first aid', 'emergency', 'stretcher', 'medical'],
    };

    const selectedCategory = (hazardCategory || '').toLowerCase();
    const selectedCategoryTerms = categoryTerms[selectedCategory] || [];

    const normalizedDescription = description.toLowerCase();

    const scenarioCitationBoosts = new Map<string, number>();

    for (const scenario of hazardScenarioSeeds) {
      const scenarioCategory = scenario.category.toLowerCase();
      const categoryMatches =
        !selectedCategory ||
        selectedCategory === 'other / unknown' ||
        selectedCategory === scenarioCategory;

      if (!categoryMatches) continue;

      const phraseMatches = scenario.phrases.filter((phrase) =>
        normalizedDescription.includes(phrase.toLowerCase()),
      );

      if (phraseMatches.length === 0) continue;

      for (const citation of scenario.citations) {
        scenarioCitationBoosts.set(
          citation,
          (scenarioCitationBoosts.get(citation) || 0) + 120 + phraseMatches.length * 25,
        );
      }
    }

    const scoreMap = new Map<string, { item: Standard; score: number }>();

    const broadWords = [
      'area',
      'damage',
      'damaged',
      'platform',
      'walkway',
      'plant',
      'section',
      'equipment',
      'unsafe',
      'broken',
      'crusher',
      'screen',
      'screens',
      'feed',
      'feeder',
      'near',
      'side',
      'rail',
      'work',
      'working',
      'place',
      'shop',
      'station',
      'maintenance',
    ];

    for (const word of words) {
      const matches = await this.standardRepo.find({
        where: [
          { heading: ILike(`%${word}%`), ...(safeSource ? { source: safeSource } : {}) },
          { standardText: ILike(`%${word}%`), ...(safeSource ? { source: safeSource } : {}) },
          { summaryPlainLanguage: ILike(`%${word}%`), ...(safeSource ? { source: safeSource } : {}) },
          {
            keywords: Raw((alias) => `LOWER(${alias}) LIKE :keyword`, {
              keyword: `%${word}%`,
            }),
            ...(safeSource ? { source: safeSource } : {}),
          },
        ],
        take: 20,
      });

      for (const match of matches) {
        let score = 0;

        const heading = (match.heading || '').toLowerCase();
        const summary = (match.summaryPlainLanguage || '').toLowerCase();
        const text = (match.standardText || '').toLowerCase();
        const keywords = JSON.stringify(match.keywords || []).toLowerCase();

        const isBroad = broadWords.includes(word);

        if (heading.includes(word)) score += isBroad ? 5 : 50;
        if (keywords.includes(word)) score += isBroad ? 5 : 35;
        if (!isBroad && summary.includes(word)) score += 20;
        if (!isBroad && text.includes(word)) score += 10;

        const categoryMatch = selectedCategoryTerms.some((term) =>
          heading.includes(term) || keywords.includes(term) || summary.includes(term),
        );

        const excludedByCategory =
          selectedCategory === 'access / ladders / platforms' &&
          (heading.includes('housekeeping') || keywords.includes('spill') || keywords.includes('oil') || keywords.includes('debris'));

        if (categoryMatch) score += 60;
        if (selectedCategoryTerms.length > 0 && !categoryMatch) score -= 45;

        const scenarioBoost = scenarioCitationBoosts.get(match.citation) || 0;
        if (scenarioBoost > 0) score += scenarioBoost;

        if (excludedByCategory) score -= 100;

        if (isBroad) score -= 35;

        const existing = scoreMap.get(match.id);

        if (existing) {
          existing.score += score;
        } else if (score > 0) {
          scoreMap.set(match.id, { item: match, score });
        }
      }
    }

    for (const [citation, boost] of scenarioCitationBoosts.entries()) {
      const standard = await this.standardRepo.findOne({
        where: { citation, ...(safeSource ? { source: safeSource } : {}) },
      });

      if (!standard) continue;

      const existing = scoreMap.get(standard.id);
      if (existing) {
        existing.score += boost;
      } else {
        scoreMap.set(standard.id, { item: standard, score: boost });
      }
    }

    const top = Array.from(scoreMap.values())
      .filter((x) => x.score >= (selectedCategoryTerms.length > 0 ? 70 : 40))
      .sort((a, b) => b.score - a.score)
      .slice(0, selectedCategoryTerms.length > 0 ? 3 : 5)
      .map((x) => x.item);

    const enriched = await Promise.all(
      top.map(async (standard) => {
        const templates = await this.correctiveTemplateRepo.find({
          where: { standardId: standard.id },
          take: 3,
        });

        return {
          ...standard,
          correctiveActionTemplates: templates,
        };
      }),
    );

    return enriched;
  }
}
