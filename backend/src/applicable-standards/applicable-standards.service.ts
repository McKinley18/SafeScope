import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standard } from '../standards/entities/standard.entity';

@Injectable()
export class ApplicableStandardsService {
  private isHousekeepingAccessScenario(text: string) {
    return /(catwalk|walkway|travelway|passageway|platform|access)/i.test(text) &&
      /(build up|buildup|accumulation|material|spillage|debris|housekeeping|slip|trip)/i.test(text);
  }

  private isMovingMachineScenario(text: string) {
    return /(unguarded|guard|moving part|rotating|shaft|pulley|belt|conveyor|nip point|pinch point|drive)/i.test(text);
  }

  constructor(
    @InjectRepository(Standard)
    private readonly standardRepo: Repository<Standard>,
  ) {}

  async suggest(description: string, hazardCategory?: string, source?: string, limit = 5) {
    const siteType =
      source === 'MSHA'
        ? 'mining'
        : source === 'OSHA_CONSTRUCTION'
          ? 'construction'
          : source === 'OSHA_GENERAL_INDUSTRY'
            ? 'general_industry'
            : undefined;

    const observation = (description || '').toLowerCase();

    const all = await this.standardRepo.find({
      where: siteType ? { scopeCode: siteType as any, isActive: true } : { isActive: true },
      take: 5000,
    });

    const fallbackStandards = this.isHousekeepingAccessScenario(observation) && siteType === 'mining'
      ? [
          {
            id: 'fallback-30-cfr-56-20003',
            citation: '30 CFR 56.20003',
            heading: 'Housekeeping',
            summary: 'Workplaces, passageways, storerooms, and service rooms must be kept clean and orderly.',
            agencyCode: 'MSHA',
            scopeCode: 'mining',
            score: 95,
            confidence: 95,
            matchingReasons: ['fallback: material accumulation / housekeeping on catwalk or travelway'],
          },
          {
            id: 'fallback-30-cfr-56-11001',
            citation: '30 CFR 56.11001',
            heading: 'Safe access',
            summary: 'Safe means of access shall be provided and maintained to all working places.',
            agencyCode: 'MSHA',
            scopeCode: 'mining',
            score: 82,
            confidence: 82,
            matchingReasons: ['fallback: catwalk/walkway safe access affected by material buildup'],
          },
        ]
      : [];

    const results = [...fallbackStandards, ...all
      .map((standard) => {
        let score = 0;
        const matchingReasons: string[] = [];

        const keywords = standard.keywords || [];

        for (const keyword of keywords) {
          if (observation.includes(keyword.toLowerCase())) {
            score += 12;
            matchingReasons.push(`keyword: ${keyword}`);
          }
        }

        const titleWords = standard.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, ' ')
          .split(/\s+/)
          .filter((word) => word.length > 4);

        for (const word of [...new Set(titleWords)]) {
          if (observation.includes(word)) {
            score += 6;
            matchingReasons.push(`title: ${word}`);
          }
        }

        if (siteType && standard.scopeCode === siteType) {
          score += 15;
          matchingReasons.push(`scope: ${siteType}`);
        }

        if (this.isHousekeepingAccessScenario(observation)) {
          if (standard.citation === '30 CFR 56.20003' || standard.citation === '30 CFR 57.20003') {
            score += 75;
            matchingReasons.push('scenario: material accumulation / housekeeping on travelway or catwalk');
          }

          if (standard.citation === '30 CFR 56.11001' || standard.citation === '30 CFR 57.11001') {
            score += 55;
            matchingReasons.push('scenario: safe access affected by material buildup on catwalk or walkway');
          }

          if (standard.citation === '1910.22(a)') {
            score += 55;
            matchingReasons.push('scenario: walking-working surface housekeeping / slip-trip exposure');
          }

          if (
            standard.citation === '30 CFR 56.14107(a)' ||
            standard.citation === '1910.212(a)(1)' ||
            standard.citation === '1910.219'
          ) {
            score -= this.isMovingMachineScenario(observation) ? 0 : 40;
            if (!this.isMovingMachineScenario(observation)) {
              matchingReasons.push('negative: no moving machine part exposure described');
            }
          }
        }

        return {
          id: standard.id,
          citation: standard.citation,
          heading: standard.title,
          summary: standard.plainLanguageSummary,
          agencyCode: standard.agencyCode,
          scopeCode: standard.scopeCode,
          score,
          confidence: Math.min(99, Math.round(score)),
          matchingReasons,
        };
      })
      .filter((item) => item.score > 0)]
      .sort((a, b) => b.score - a.score)
      .filter((item, index, arr) => arr.findIndex((other) => other.citation === item.citation) === index)
      .slice(0, limit);

    return results;
  }
}
