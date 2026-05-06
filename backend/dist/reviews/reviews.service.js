"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const classification_entity_1 = require("../classifications/entities/classification.entity");
const review_entity_1 = require("./entities/review.entity");
const audit_service_1 = require("../audit/audit.service");
let ReviewsService = class ReviewsService {
    constructor(classificationRepo, reviewRepo, auditService) {
        this.classificationRepo = classificationRepo;
        this.reviewRepo = reviewRepo;
        this.auditService = auditService;
    }
    async getReviewQueue() {
        return this.classificationRepo.find({
            where: {
                requiresHumanReview: true,
                classificationStatus: 'pending',
            },
        });
    }
    async review(classificationId, action, notes, reviewerUserId) {
        const classification = await this.classificationRepo.findOne({ where: { id: classificationId } });
        if (!classification)
            throw new Error('Classification not found');
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(classification_entity_1.Classification)),
    __param(1, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map