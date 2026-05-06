import { Repository } from 'typeorm';
import { RegulatorySection } from './entities/regulatory-section.entity';
import { RegulatoryPart } from './entities/regulatory-part.entity';
export declare class RegulatoryService {
    private sectionRepo;
    private partRepo;
    constructor(sectionRepo: Repository<RegulatorySection>, partRepo: Repository<RegulatoryPart>);
    getParts(agency: string): Promise<RegulatoryPart[]>;
    searchSections(agency: string, part: string, query?: string): Promise<RegulatorySection[]>;
    getSection(citation: string): Promise<RegulatorySection>;
}
