import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';
import { Finding } from './finding.entity';

import { StandardsModule } from '../standards/standards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Finding]),
    StandardsModule, // 🔑 THIS FIXES YOUR ERROR
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
