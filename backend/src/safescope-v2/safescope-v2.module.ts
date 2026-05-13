import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafescopeV2Service } from './safescope-v2.service';
import { SafescopeV2Controller } from './safescope-v2.controller';
import { ActionEngineModule } from '../action-engine/action-engine.module';
import { ApplicableStandardsModule } from '../applicable-standards/applicable-standards.module';
import { ContextExpansionService } from './context/context-expansion.service';
import { EvidenceFusionService } from './evidence/evidence-fusion.service';
import { SafeScopeFeedback } from './feedback/safescope-feedback.entity';
import { SafeScopeFeedbackService } from './feedback/safescope-feedback.service';
import { SafeScopeFeedbackController } from './feedback/safescope-feedback.controller';

@Module({
  imports: [
    ActionEngineModule,
    ApplicableStandardsModule,
    TypeOrmModule.forFeature([SafeScopeFeedback]),
  ],
  controllers: [
    SafescopeV2Controller,
    SafeScopeFeedbackController,
  ],
  providers: [
    SafescopeV2Service,
    ContextExpansionService,
    EvidenceFusionService,
    SafeScopeFeedbackService,
  ],
})
export class SafescopeV2Module {}
