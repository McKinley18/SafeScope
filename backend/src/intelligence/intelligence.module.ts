import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HazardFixService } from './hazard-fix.service';
import { FixFeedbackService } from './fix-feedback.service';
import { FixFeedback } from './fix-feedback.entity';
import { CorrectiveActionsModule } from '../corrective-actions/corrective-actions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FixFeedback]),
    forwardRef(() => CorrectiveActionsModule),
  ],
  providers: [HazardFixService, FixFeedbackService],
  exports: [HazardFixService, FixFeedbackService],
})
export class IntelligenceModule {}
