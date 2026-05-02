import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ExecutiveService } from './executive/executive.service';
import { ExecutiveController } from './executive/executive.controller';
import { Report } from './entities/report.entity';
import { ReportAttachment } from './entities/attachment.entity';
import { Review } from '../reviews/entities/review.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { AuditModule } from '../audit/audit.module';
import { ClassificationsModule } from '../classifications/classifications.module';
import { StandardsModule } from '../standards/standards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportAttachment, Review, CorrectiveAction]),
    AuditModule,
    ClassificationsModule,
    StandardsModule,
  ],
  controllers: [ReportsController, ExecutiveController],
  providers: [ReportsService, ExecutiveService],
  exports: [ReportsService],
})
export class ReportsModule {}
