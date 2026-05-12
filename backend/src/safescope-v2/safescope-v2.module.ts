import { Module } from '@nestjs/common';
import { SafescopeV2Service } from './safescope-v2.service';
import { SafescopeV2Controller } from './safescope-v2.controller';
import { ActionEngineModule } from '../action-engine/action-engine.module';

@Module({
  imports: [ActionEngineModule],
  controllers: [SafescopeV2Controller],
  providers: [SafescopeV2Service],
})
export class SafescopeV2Module {}
