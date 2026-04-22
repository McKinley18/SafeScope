import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskService } from './risk.service';
import { RiskScore } from './entities/risk-score.entity';
import { Classification } from '../classifications/entities/classification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RiskScore, Classification])],
  providers: [RiskService],
  exports: [RiskService],
})
export class RiskModule {}
