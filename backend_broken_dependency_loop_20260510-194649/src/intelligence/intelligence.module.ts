import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixFeedbackService } from './fix-feedback.service';
import { FixFeedback } from './fix-feedback.entity';
import { MatchEngine } from './engine/match.engine';

@Module({
  imports: [TypeOrmModule.forFeature([FixFeedback])],
  providers: [FixFeedbackService, MatchEngine],
  exports: [FixFeedbackService, MatchEngine]
})
export class IntelligenceModule {}
