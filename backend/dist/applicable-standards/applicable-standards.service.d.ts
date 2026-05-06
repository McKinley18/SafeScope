import { Repository } from 'typeorm';
import { Standard } from '../standards/entities/standard.entity';
export declare class ApplicableStandardsService {
    private readonly standardRepo;
    constructor(standardRepo: Repository<Standard>);
    suggest(description: string, hazardCategory?: string, source?: string, limit?: number): Promise<{
        id: string;
        citation: string;
        heading: string;
        summary: string;
        agencyCode: import("../standards/entities/standard.entity").AgencyCode;
        scopeCode: import("../standards/entities/standard.entity").StandardScope;
        score: number;
        confidence: number;
        matchingReasons: string[];
    }[]>;
}
