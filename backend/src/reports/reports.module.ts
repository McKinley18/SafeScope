import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { Finding } from './entities/finding.entity';
import { StandardsModule } from '../standards/standards.module';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Finding]),
    StandardsModule,
    IntelligenceModule,
    AlertsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
