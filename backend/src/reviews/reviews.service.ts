import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Classification } from '../classifications/entities/classification.entity';
import { Review } from './entities/review.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Classification) private classificationRepo: Repository<Classification>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    private auditService: AuditService,
  ) {}

  async getReviewQueue() {
    return this.classificationRepo.find({
      where: {
        requiresHumanReview: true,
        classificationStatus: 'pending',
      },
    });
  }

  async review(classificationId: string, action: any, notes: string, reviewerUserId: string) {
    const classification = await this.classificationRepo.findOne({ where: { id: classificationId } });
    if (!classification) throw new Error('Classification not found');

    const review = this.reviewRepo.create({
      reportId: classification.reportId,
      classificationId,
      reviewAction: action,
      notes,
      reviewerUserId,
    });
    
    classification.classificationStatus = action === 'approve' ? 'approved' : 'rejected';
    classification.reviewedAt = new Date();
    await this.classificationRepo.save(classification);
    const savedReview = await this.reviewRepo.save(review);

    await this.auditService.log({
      entityType: 'REVIEW',
      entityId: savedReview.id,
      actionCode: `REVIEW_${action.toUpperCase()}`,
      afterJson: savedReview,
      actorUserId: reviewerUserId,
    });

    return savedReview;
  }
}
