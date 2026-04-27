import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Standard } from './entities/standard.entity';
import { CorrectiveActionTemplate } from './entities/corrective-action-template.entity';

@Injectable()
export class StandardsService {
  constructor(
    @InjectRepository(Standard)
    private standardRepo: Repository<Standard>,
    @InjectRepository(CorrectiveActionTemplate)
    private correctiveTemplateRepo: Repository<CorrectiveActionTemplate>,
  ) {}

  async search(query?: string, source?: string) {
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

  async suggest(description: string, source?: string) {
    const standardsCount = await this.standardRepo.count();

    if (standardsCount === 0) {
      console.error('CRITICAL: Standards database is empty. Run npm run seed.');
      return [];
    }

    const safeSource = source === 'MSHA' || source === 'OSHA' ? source : undefined;

    const words = description
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .slice(0, 8);

    const results = [];

    for (const word of words) {
      const matches = await this.standardRepo.find({
        where: [
          { heading: ILike(`%${word}%`), ...(safeSource ? { source: safeSource } : {}) },
          { standardText: ILike(`%${word}%`), ...(safeSource ? { source: safeSource } : {}) },
        ],
        take: 5,
      });

      results.push(...matches);
    }

    const unique = Array.from(new Map(results.map((r) => [r.id, r])).values());

    const top = unique.slice(0, 10);

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
