import { Controller, Get } from '@nestjs/common';
import { Classification } from '../classifications/entities/classification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('review-queue')
export class ReviewQueueController {
  constructor(
    @InjectRepository(Classification) private classificationRepo: Repository<Classification>,
  ) {}

  @Get()
  async getQueue() {
    return this.classificationRepo.find({
      where: {
        requiresHumanReview: true,
        classificationStatus: 'pending',
      },
    });
  }
}
