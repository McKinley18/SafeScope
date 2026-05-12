import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

// 🔥 IMPORT YOUR ENTITIES
import { Report } from './entities/report.entity';
import { Finding } from './entities/finding.entity';
import { ReportAttachment } from './entities/attachment.entity';

// 🔥 IMPORT DEPENDENCIES
import { StandardsModule } from '../standards/standards.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { ActionEngineModule } from '../action-engine/action-engine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Finding, ReportAttachment]), // 🔥 THIS FIXES THE ERROR
    StandardsModule,
    RecommendationsModule,
    forwardRef(() => ActionEngineModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
