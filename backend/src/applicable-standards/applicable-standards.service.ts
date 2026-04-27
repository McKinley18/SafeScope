import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Raw } from 'typeorm';
import { Standard } from '../standards/entities/standard.entity';
import { CorrectiveActionTemplate } from '../standards/entities/corrective-action-template.entity';
import { RegulatorySection } from '../regulatory/entities/regulatory-section.entity';

@Injectable()
export class ApplicableStandardsService {
  constructor(
    @InjectRepository(Standard) private standardRepo: Repository<Standard>,
    @InjectRepository(CorrectiveActionTemplate) private templateRepo: Repository<CorrectiveActionTemplate>,
    @InjectRepository(RegulatorySection) private sectionRepo: Repository<RegulatorySection>,
  ) {}

  async suggest(desc: string, category: string, source: string, limit: number = 5) {
    const rawWords = desc.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const catWords = category.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const all = await this.standardRepo.find({ where: { source: source as any } });
    
    const scored = all.map(s => {
      let score = 0;
      const matchingReasons = [];
      for(const w of rawWords) if(s.keywords.includes(w)) { score += 50; matchingReasons.push('keyword: ' + w); }
      for(const w of catWords) if(s.heading.toLowerCase().includes(w)) { score += 25; matchingReasons.push('category: ' + w); }
      return { ...s, score, matchingReasons };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    const unique = Array.from(new Map(scored.map(s => [s.citation, s])).values());
    
    return Promise.all(unique.slice(0, limit).map(async s => {
        const template = await this.templateRepo.findOne({ where: { standardId: s.id } });
        const reg = await this.sectionRepo.findOne({ where: { citation: s.citation } });
        return {
            citation: s.citation,
            heading: s.heading,
            summary: reg?.summaryPlainLanguage || s.summaryPlainLanguage,
            relevanceScore: s.score,
            reasonMatched: s.matchingReasons,
            correctiveAction: template ? { title: template.title, recommendedAction: template.recommendedAction } : null
        };
    }));
  }
}
