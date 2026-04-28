import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Raw } from 'typeorm';
import { Standard } from './entities/standard.entity';
import { CorrectiveActionTemplate } from './entities/corrective-action-template.entity';
import { RegulatorySection } from '../regulatory/entities/regulatory-section.entity';

@Injectable()
export class StandardsService {
  private readonly ELITE_PHRASES: Record<string, string> = {
    'conveyor missing guard': '56.14107',
    'ladder broken': '56.11001',
    'extinguisher blocked': '56.4201',
    'no lockout': '56.14105',
    'dust cloud': '56.5001'
  };

  constructor(
    @InjectRepository(Standard) private standardRepo: Repository<Standard>,
    @InjectRepository(CorrectiveActionTemplate) private templateRepo: Repository<CorrectiveActionTemplate>,
    @InjectRepository(RegulatorySection) private sectionRepo: Repository<RegulatorySection>,
  ) {}

  async search(query?: string, source?: string) {
    const where: any = {};
    if (source) where.source = source;
    if (query) where.heading = ILike(`%${query}%`);
    return await this.standardRepo.find({ where, take: 25 });
  }

  async suggest(desc: string, category: string = 'Other', source: string = 'MSHA', limit: number = 8) {
    const descLower = desc.toLowerCase();
    const all = await this.standardRepo.find({ where: { source: source as any } });
    
    const scored = all.map(s => {
      let score = 0;
      for (const phrase in this.ELITE_PHRASES) {
        if (descLower.includes(phrase) && s.citation.includes(this.ELITE_PHRASES[phrase])) score += 250;
      }
      if(descLower.includes(s.heading.toLowerCase())) score += 150;
      if(s.citation.split('.').length > 2) score += 50;
      if(s.heading.toLowerCase().includes(category.toLowerCase())) score += 15;
      s.keywords?.forEach(w => { if (descLower.includes(w.toLowerCase())) score += 20; });
      return { ...s, score };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    const unique = Array.from(new Map(scored.map(s => [s.citation, s])).values());
    const top = unique.slice(0, limit);
    
    const enrich = async (s: any) => {
        const reg = await this.sectionRepo.findOne({ where: { citation: s.citation } });
        return {
            citation: s.citation,
            heading: s.heading,
            summary: reg?.summaryPlainLanguage || s.summaryPlainLanguage,
            confidence: s.score > 150 ? 'High' : 'Medium'
        };
    };

    return {
        primary: await Promise.all(top.slice(0, 2).map(enrich)),
        secondary: await Promise.all(top.slice(2, 5).map(enrich)),
        additional: await Promise.all(top.slice(5).map(enrich))
    };
  }
}
