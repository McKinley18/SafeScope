import { Module } from '@nestjs/common';
import { MatchEngine } from './engine/match.engine';

@Module({
  providers: [MatchEngine],
  exports: [MatchEngine]
})
export class IntelligenceModule {}
