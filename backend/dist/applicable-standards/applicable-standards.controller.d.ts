import { ApplicableStandardsService } from './applicable-standards.service';
import { SuggestStandardsDto } from './dto/applicable-standards.dto';
export declare class ApplicableStandardsController {
    private service;
    constructor(service: ApplicableStandardsService);
    suggest(dto: SuggestStandardsDto): Promise<{
        matches: {
            id: string;
            citation: string;
            heading: string;
            summary: string;
            agencyCode: import("../standards/entities/standard.entity").AgencyCode;
            scopeCode: import("../standards/entities/standard.entity").StandardScope;
            score: number;
            confidence: number;
            matchingReasons: string[];
        }[];
    }>;
}
