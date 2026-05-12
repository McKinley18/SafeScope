import { Module } from '@nestjs/common';
import { SafescopeV2Service } from './safescope-v2.service';
import { SafescopeV2Controller } from './safescope-v2.controller';
import { ActionEngineModule } from '../action-engine/action-engine.module';
import { ContextExpansionService } from './context/context-expansion.service';
import { EvidenceFusionService } from './evidence/evidence-fusion.service';

@Module({
  imports: [ActionEngineModule],
  controllers: [SafescopeV2Controller],
  providers: [SafescopeV2Service, ContextExpansionService, EvidenceFusionService],
})
export class SafescopeV2Module {}
