import { Classification } from '../classifications/entities/classification.entity';
import { Repository } from 'typeorm';
export declare class ReviewQueueController {
    private classificationRepo;
    constructor(classificationRepo: Repository<Classification>);
    getQueue(): Promise<Classification[]>;
}
