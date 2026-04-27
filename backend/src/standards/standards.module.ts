import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardsController } from './standards.controller';
import { StandardsService } from './standards.service';
import { StandardsSeedService } from './standards-seed.service';
import { Standard } from './entities/standard.entity';
import { HazardCategoryEntity } from './entities/hazard-category.entity';
import { HazardStandardMapping } from './entities/hazard-standard-mapping.entity';
import { CorrectiveActionTemplate } from './entities/corrective-action-template.entity';
import { ReportLanguageTemplate } from './entities/report-language-template.entity';
import { ClassificationFeedback } from './entities/classification-feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Standard,
      HazardCategoryEntity,
      HazardStandardMapping,
      CorrectiveActionTemplate,
      ReportLanguageTemplate,
      ClassificationFeedback,
    ]),
  ],
  controllers: [StandardsController],
  providers: [StandardsService, StandardsSeedService],
  exports: [StandardsService],
})
export class StandardsModule {}
