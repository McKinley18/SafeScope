import { Repository } from 'typeorm';
import { Classification } from '../classifications/entities/classification.entity';
import { Review } from './entities/review.entity';
import { AuditService } from '../audit/audit.service';
export declare class ReviewsService {
    private classificationRepo;
    private reviewRepo;
    private auditService;
    constructor(classificationRepo: Repository<Classification>, reviewRepo: Repository<Review>, auditService: AuditService);
    getReviewQueue(): Promise<Classification[]>;
    review(classificationId: string, action: any, notes: string, reviewerUserId: string): Promise<Review>;
}
