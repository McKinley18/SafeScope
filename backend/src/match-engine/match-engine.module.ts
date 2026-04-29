import { Module } from '@nestjs/common';
import { MatchEngineService } from './match-engine.service';

@Module({
  providers: [MatchEngineService],
  exports: [MatchEngineService],
})
export class MatchEngineModule {}
