import { Repository } from 'typeorm';
import { HazardTaxonomy } from './entities/hazard-taxonomy.entity';
export declare class IntelligenceService {
    private repo;
    constructor(repo: Repository<HazardTaxonomy>);
}
