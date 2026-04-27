import { DataSource } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { ReportAttachment } from '../reports/entities/attachment.entity';
import { Classification } from '../classifications/entities/classification.entity';
import { ClassificationRule } from '../taxonomy/entities/rule.entity'; '../classifications/entities/classification.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { Review } from '../reviews/entities/review.entity';
import { RiskScore } from '../risk/entities/risk-score.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';

import { Standard } from '../standards/entities/standard.entity';
import { HazardCategoryEntity } from '../standards/entities/hazard-category.entity';
import { HazardStandardMapping } from '../standards/entities/hazard-standard-mapping.entity';
import { CorrectiveActionTemplate } from '../standards/entities/corrective-action-template.entity';
import { ReportLanguageTemplate } from '../standards/entities/report-language-template.entity';
import { ClassificationFeedback } from '../standards/entities/classification-feedback.entity';


export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'safescope',
  entities: [
    Report,
    ReportAttachment,
    Classification,
    ClassificationRule,
    AuditLog,
    Review,
    RiskScore,
    CorrectiveAction,
    Standard,
    HazardCategoryEntity,
    HazardStandardMapping,
    CorrectiveActionTemplate,
    ReportLanguageTemplate,
    ClassificationFeedback,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: true,
});
