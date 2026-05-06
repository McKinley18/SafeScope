import { Repository } from 'typeorm';
import { Standard } from './entities/standard.entity';
import { CorrectiveActionTemplate } from './entities/corrective-action-template.entity';
export declare class StandardsSeedService {
    private standardRepo;
    private correctiveTemplateRepo;
    constructor(standardRepo: Repository<Standard>, correctiveTemplateRepo: Repository<CorrectiveActionTemplate>);
    seedDefaults(): Promise<{
        ok: boolean;
        created: number;
        updated: number;
        total: number;
    }>;
}
