import { Repository } from 'typeorm';
import { HazardTaxonomy } from './entities/hazard-taxonomy.entity';
export declare class IntelligenceService {
    private repo;
    constructor(repo: Repository<HazardTaxonomy>);
    analyze(description: string): Promise<{
        condition: any;
        confidence: number;
        questions: any;
        standards: any;
    } | {
        condition: string;
        confidence: number;
        questions?: undefined;
        standards?: undefined;
    }>;
}
