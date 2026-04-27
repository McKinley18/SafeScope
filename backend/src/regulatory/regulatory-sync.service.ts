import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { RegulatoryAgency } from './entities/regulatory-agency.entity';
import { RegulatoryPart } from './entities/regulatory-part.entity';
import { RegulatorySubpart } from './entities/regulatory-subpart.entity';
import { RegulatorySection } from './entities/regulatory-section.entity';
import { RegulatoryParagraph } from './entities/regulatory-paragraph.entity';

@Injectable()
export class RegulatorySyncService {
  constructor(
    @InjectRepository(RegulatorySection) private sectionRepo: Repository<RegulatorySection>,
    @InjectRepository(RegulatoryPart) private partRepo: Repository<RegulatoryPart>,
    @InjectRepository(RegulatoryAgency) private agencyRepo: Repository<RegulatoryAgency>,
    @InjectRepository(RegulatorySubpart) private subpartRepo: Repository<RegulatorySubpart>,
    @InjectRepository(RegulatoryParagraph) private paragraphRepo: Repository<RegulatoryParagraph>,
  ) {}

  async syncFullPart56() {
    const url = 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml';
    const response = await axios.get(url);
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    const result = await parser.parseStringPromise(response.data);
    
    const findPart56 = (node: any): any => {
      if (node.TYPE === 'PART' && node.HEAD?.includes('PART 56')) return node;
      for (const key in node) {
        if (typeof node[key] === 'object') {
          const found = findPart56(node[key]);
          if (found) return found;
        }
      }
      return null;
    };

    const part56 = findPart56(result);
    if (!part56) throw new Error('Part 56 not found');

    await this.agencyRepo.upsert({ code: 'MSHA', name: 'Mine Safety and Health Administration', titleNumber: '30' }, ['code']);
    await this.partRepo.upsert({ agencyCode: 'MSHA', titleNumber: '30', part: '56', heading: part56.HEAD }, ['agencyCode', 'titleNumber', 'part']);

    // Cleanup malformed citations from earlier parser version, e.g. "30 CFR 56.56.14109".
    await this.paragraphRepo
      .createQueryBuilder()
      .delete()
      .where('sectionCitation LIKE :badCitation', { badCitation: '30 CFR 56.56.%' })
      .execute();

    await this.sectionRepo
      .createQueryBuilder()
      .delete()
      .where('citation LIKE :badCitation', { badCitation: '30 CFR 56.56.%' })
      .execute();

    let sectionsUpserted = 0;
    let paragraphsUpserted = 0;
    let subpartsUpserted = 0;

    // Traverse DIV nodes that are SUBPARTS
    const subparts = Array.isArray(part56.DIV6) ? part56.DIV6 : [part56.DIV6];
    for (const subpart of subparts) {
        const subpartTitle = subpart.HEAD || 'Subpart';
        await this.subpartRepo.upsert({ agencyCode: 'MSHA', titleNumber: '30', part: '56', subpart: subpartTitle, heading: subpartTitle }, ['agencyCode', 'titleNumber', 'part', 'subpart']);
        subpartsUpserted++;
        
        // Sections are inside nested DIVs
        const traverseSections = async (node: any) => {
            if (node.TYPE === 'SECTION') {
                const sectionNo = node.N.replace('§ ', '').trim();
                const citation = `30 CFR ${sectionNo}`;
                await this.sectionRepo.upsert({
                    agencyCode: 'MSHA', titleNumber: '30', part: '56', subpart: subpartTitle, 
                    section: sectionNo, citation, heading: node.HEAD, textPlain: Array.isArray(node.P) ? node.P.join(' ') : node.P
                }, ['citation']);
                sectionsUpserted++;
                
                if (Array.isArray(node.P)) {
                    for (let i = 0; i < node.P.length; i++) {
                        await this.paragraphRepo.upsert({ sectionCitation: citation, textPlain: node.P[i], sortOrder: i }, ['sectionCitation', 'textPlain']);
                        paragraphsUpserted++;
                    }
                }
            } else {
                for (const key in node) {
                    if (typeof node[key] === 'object') await traverseSections(node[key]);
                }
            }
        };
        await traverseSections(subpart);
    }

    return { agenciesUpserted: 1, partsUpserted: 1, subpartsUpserted, sectionsUpserted, paragraphsUpserted, errors: [] };
  }
}
