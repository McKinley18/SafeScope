import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { ReportAttachment } from './entities/attachment.entity';
import { Review } from '../reviews/entities/review.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { AuditModule } from '../audit/audit.module';
import { ClassificationsModule } from '../classifications/classifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportAttachment, Review, CorrectiveAction]),
    AuditModule,
    ClassificationsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
