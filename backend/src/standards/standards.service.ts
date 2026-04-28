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
    'pulley missing guard': '56.14107',
    'missing guard pulley': '56.14107',
    'tail pulley missing guard': '56.14107',
    'conveyor pulley missing guard': '56.14107',
    'ladder broken': '56.11003',
    'damaged ladder': '56.11003',
    'bent ladder': '56.11003',
    'bent side rail': '56.11003',
    'ladder bent rail': '56.11003',
    'ladder damaged': '56.11003',
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
    const descLower = (desc || '').toLowerCase();
    const categoryLower = (category || '').toLowerCase();
    const agencyCode = source === 'OSHA' ? 'OSHA' : 'MSHA';

    const normalizeCitation = (citation: string) =>
      (citation || '')
        .replace(/30 CFR 56\.56\./g, '30 CFR 56.')
        .replace(/30 CFR 57\.57\./g, '30 CFR 57.')
        .replace(/29 CFR 1910\.1910\./g, '29 CFR 1910.')
        .replace(/29 CFR 1926\.1926\./g, '29 CFR 1926.');

    const categoryKeywords: Record<string, string[]> = {
      'access': ['access', 'ladder', 'stairs', 'platform', 'walkway', 'travelway', 'walking', 'working surface'],
      'machine': ['guard', 'guarding', 'unguarded', 'conveyor', 'pulley', 'belt', 'crusher', 'moving part', 'pinch point'],
      'electrical': ['electrical', 'cord', 'wire', 'panel', 'junction', 'breaker', 'conductor', 'insulation'],
      'lockout': ['lockout', 'tagout', 'blocked against motion', 'jam', 'maintenance', 'energy'],
      'mobile': ['truck', 'loader', 'mobile equipment', 'backup alarm', 'horn', 'traffic'],
      'berm': ['berm', 'guardrail', 'haul road', 'roadway', 'dump point'],
      'fire': ['fire', 'extinguisher', 'hot work', 'fuel', 'flammable'],
      'housekeeping': ['housekeeping', 'trash', 'debris', 'spill', 'oil', 'walkway'],
      'fall': ['fall', 'harness', 'lanyard', 'elevated', 'edge'],
      'ppe': ['ppe', 'hard hat', 'eye protection', 'boots', 'gloves', 'footwear'],
      'health': ['dust', 'silica', 'noise', 'respiratory', 'hearing', 'airborne'],
      'materials': ['cylinder', 'compressed gas', 'storage', 'material'],
      'emergency': ['first aid', 'emergency', 'exit', 'escape'],
      'training': ['training', 'exam', 'record', 'reporting'],
    };

    const categoryTerms = Object.entries(categoryKeywords)
      .filter(([key]) => categoryLower.includes(key))
      .flatMap(([, terms]) => terms);

    const scoreText = (citation: string, heading: string, body: string, keywords: string[] = []) => {
      const headingLower = (heading || '').toLowerCase();
      const bodyLower = (body || '').toLowerCase();
      let score = 0;
      const reasons: string[] = [];

      for (const phrase in this.ELITE_PHRASES) {
        if (descLower.includes(phrase) && citation.includes(this.ELITE_PHRASES[phrase])) {
          score += 250;
          reasons.push(`elite phrase: ${phrase}`);
        }
      }

      for (const term of [...categoryTerms, ...keywords]) {
        const t = term.toLowerCase();
        if (!t || t.length < 3) continue;
        if (descLower.includes(t)) {
          if (headingLower.includes(t)) {
            score += 80;
            reasons.push(`heading/category: ${t}`);
          } else if (bodyLower.includes(t)) {
            score += 35;
            reasons.push(`text/category: ${t}`);
          }
        }
      }

      for (const token of descLower.split(/[^a-z0-9.]+/).filter(Boolean)) {
        if (token.length < 4) continue;
        if (headingLower.includes(token)) {
          score += 30;
          reasons.push(`heading keyword: ${token}`);
        } else if (bodyLower.includes(token)) {
          score += 10;
          reasons.push(`text keyword: ${token}`);
        }
      }

      if (citation.includes('56.141') && /guard|conveyor|pulley|crusher|moving/.test(descLower)) score += 90;
      if (citation.includes('56.110') && /ladder|access|platform|walkway|travelway|stairs/.test(descLower)) score += 90;
      if (citation.includes('56.120') && /electrical|cord|wire|panel|junction|conductor/.test(descLower)) score += 90;
      if (citation.includes('56.420') && /fire|extinguisher|hot work|fuel/.test(descLower)) score += 90;
      if (citation.includes('56.500') && /dust|silica|airborne|respirable|particulate/.test(descLower)) score += 90;
      if (citation.includes('56.9300') && /berm|guardrail|haul road|roadway|dump/.test(descLower)) score += 90;

      return { score, reasons };
    };

    const curated = await this.standardRepo.find({ where: { source: source as any } });

    const curatedScored = curated.map((s) => {
      const scored = scoreText(
        normalizeCitation(s.citation),
        s.heading,
        `${s.standardText || ''} ${s.summaryPlainLanguage || ''}`,
        s.keywords || []
      );

      return {
        citation: normalizeCitation(s.citation),
        heading: s.heading,
        summary: s.summaryPlainLanguage,
        score: scored.score,
        reasonsMatched: scored.reasons,
      };
    });

    const sections = await this.sectionRepo.find({
      where: { agencyCode },
      take: 2500,
    });

    const sectionScored = sections.map((section) => {
      const scored = scoreText(
        normalizeCitation(section.citation),
        section.heading || '',
        section.textPlain || '',
        []
      );

      return {
        citation: normalizeCitation(section.citation),
        heading: section.heading,
        summary: section.summaryPlainLanguage,
        score: scored.score,
        reasonsMatched: scored.reasons,
      };
    });

    const merged = [...curatedScored, ...sectionScored]
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const unique = Array.from(new Map(merged.map((item) => [item.citation, item])).values());
    const top = unique.slice(0, limit);

    const enrich = async (item: any) => {
      const normalizedCitation = normalizeCitation(item.citation);
      const reg =
        (await this.sectionRepo.findOne({ where: { citation: normalizedCitation } })) ||
        (await this.sectionRepo.findOne({ where: { citation: item.citation } }));
      return {
        citation: normalizedCitation,
        heading: item.heading || reg?.heading,
        summary: item.summary || reg?.summaryPlainLanguage || reg?.textPlain?.slice(0, 220),
        relevanceScore: item.score,
        confidenceBand: item.score >= 150 ? 'High' : item.score >= 70 ? 'Medium' : 'Low',
        reasonMatched: item.reasonsMatched || [],
      };
    };

    return {
      primary: await Promise.all(top.slice(0, 2).map(enrich)),
      secondary: await Promise.all(top.slice(2, 5).map(enrich)),
      additional: await Promise.all(top.slice(5).map(enrich)),
    };
  }
}
