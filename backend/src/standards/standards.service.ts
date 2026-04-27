import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Raw } from 'typeorm';
import { Standard } from './entities/standard.entity';
import { CorrectiveActionTemplate } from './entities/corrective-action-template.entity';
import { RegulatorySection } from '../regulatory/entities/regulatory-section.entity';

@Injectable()
export class StandardsService {
  constructor(
    @InjectRepository(Standard) private standardRepo: Repository<Standard>,
    @InjectRepository(CorrectiveActionTemplate) private correctiveTemplateRepo: Repository<CorrectiveActionTemplate>,
    @InjectRepository(RegulatorySection) private sectionRepo: Repository<RegulatorySection>,
  ) {}

  async search(query?: string, source?: string) {
    const where: any = {};
    if (source) where.source = source;
    if (query) where.heading = ILike(`%${query}%`);
    return await this.standardRepo.find({ where, take: 25 });
  }

  async suggest(description: string, source?: string, hazardCategory?: string) {
    const safeSource = source === 'MSHA' || source === 'OSHA' ? source : undefined;
    const rawWords = description.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const words = Array.from(new Set(rawWords)).slice(0, 25);

    let results: Standard[] = [];
    for (const word of words) {
      const matches = await this.standardRepo.find({
        where: [
          { heading: ILike(`%${word}%`), ...(safeSource ? { source: safeSource } : {}) },
          { keywords: Raw((alias) => `LOWER(${alias}) LIKE :keyword`, { keyword: `%${word}%` }), ...(safeSource ? { source: safeSource } : {}) },
        ],
        take: 5,
      });
      results.push(...matches);
    }

    const unique = Array.from(new Map(results.map((r) => [r.id, r])).values());

    return await Promise.all(unique.slice(0, 5).map(async (standard) => {
        const templates = await this.correctiveTemplateRepo.find({ where: { standardId: standard.id }, take: 3 });
        
        // Match standard citation to RegulatorySection
        const regSection = await this.sectionRepo.findOne({ 
            where: { citation: standard.citation } 
        });

        return {
          ...standard,
          correctiveActionTemplates: templates,
          regulatoryReference: regSection ? {
            citation: regSection.citation,
            heading: regSection.heading,
            summaryPlainLanguage: regSection.summaryPlainLanguage,
            sourceUrl: regSection.sourceUrl
          } : null
        };
      }),
    );
  }
}
