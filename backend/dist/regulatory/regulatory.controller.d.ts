import { RegulatorySyncService } from './regulatory-sync.service';
import { RegulatoryService } from './regulatory.service';
import { ConfigService } from '@nestjs/config';
export declare class RegulatoryController {
    private syncService;
    private regulatoryService;
    private config;
    constructor(syncService: RegulatorySyncService, regulatoryService: RegulatoryService, config: ConfigService);
    parts(agency?: string): Promise<import("./entities/regulatory-part.entity").RegulatoryPart[]>;
    sections(agency?: string, part?: string, q?: string): Promise<import("./entities/regulatory-section.entity").RegulatorySection[]>;
    section(citation: string): Promise<import("./entities/regulatory-section.entity").RegulatorySection>;
    sync(key: string, part: string, headerKey: string): Promise<any>;
}
