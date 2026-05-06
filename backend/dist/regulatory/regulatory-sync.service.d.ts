import { Repository } from 'typeorm';
import { RegulatoryAgency } from './entities/regulatory-agency.entity';
import { RegulatoryPart } from './entities/regulatory-part.entity';
import { RegulatorySubpart } from './entities/regulatory-subpart.entity';
import { RegulatorySection } from './entities/regulatory-section.entity';
import { RegulatoryParagraph } from './entities/regulatory-paragraph.entity';
export declare class RegulatorySyncService {
    private sectionRepo;
    private partRepo;
    private agencyRepo;
    private subpartRepo;
    private paragraphRepo;
    constructor(sectionRepo: Repository<RegulatorySection>, partRepo: Repository<RegulatoryPart>, agencyRepo: Repository<RegulatoryAgency>, subpartRepo: Repository<RegulatorySubpart>, paragraphRepo: Repository<RegulatoryParagraph>);
    syncRegulatoryPart(opts: {
        agencyCode: string;
        agencyName: string;
        titleNumber: string;
        part: string;
        bulkXmlUrl: string;
    }): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart46(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart47(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart48(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart50(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart56(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart57(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart62(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncPart77(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncOsha1904(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncOsha1910(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
    syncOsha1926(): Promise<{
        sectionsUpserted: number;
        paragraphsUpserted: number;
    }>;
}
