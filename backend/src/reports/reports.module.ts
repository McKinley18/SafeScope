import { ClassificationsModule } from "../classifications/classifications.module";
import { AuditModule } from "../audit/audit.module";
import { Review } from "../reviews/entities/review.entity";
import { CorrectiveAction } from "../corrective-actions/entities/corrective-action.entity";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ExecutiveService } from './executive/executive.service';
import { PdfService } from './pdf/pdf.service';
import { ExecutiveController } from './executive/executive.controller';
import { Report } from './entities/report.entity';
import { ReportAttachment } from './entities/attachment.entity';
import { StandardsModule } from '../standards/standards.module';
import { ControlVerificationsModule } from "../control-verifications/control-verifications.module";

@Module({
  imports: [ClassificationsModule, AuditModule, StandardsModule, 
    TypeOrmModule.forFeature([Report, ReportAttachment, Review, CorrectiveAction]),
    ControlVerificationsModule,
  ],
  controllers: [ReportsController, ExecutiveController],
  providers: [ReportsService, ExecutiveService, PdfService],
  exports: [ReportsService],
})
export class ReportsModule {}
