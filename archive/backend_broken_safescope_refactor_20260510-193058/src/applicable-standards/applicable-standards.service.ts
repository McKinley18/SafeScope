import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standard } from '../standards/entities/standard.entity';

@Injectable()
export class ApplicableStandardsService {
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

    const results = all
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
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }
}
