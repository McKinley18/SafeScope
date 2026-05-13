import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Standard } from '../standards/entities/standard.entity';
import { CorrectiveActionTemplate } from '../standards/entities/corrective-action-template.entity';
import { RegulatorySection } from '../regulatory/entities/regulatory-section.entity';
import { ApplicableStandardsController } from './applicable-standards.controller';
import { ApplicableStandardsService } from './applicable-standards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Standard, CorrectiveActionTemplate, RegulatorySection])],
  controllers: [ApplicableStandardsController],
  providers: [ApplicableStandardsService],
  exports: [ApplicableStandardsService],
})
export class ApplicableStandardsModule {}
