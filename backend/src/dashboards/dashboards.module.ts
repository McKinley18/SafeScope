import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../reports/entities/report.entity';
import { Classification } from '../classifications/entities/classification.entity';
import { Review } from '../reviews/entities/review.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Classification, Review, CorrectiveAction])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardsModule {}
