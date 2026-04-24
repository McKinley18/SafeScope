import { DataSource } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { Classification } from '../classifications/entities/classification.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { Review } from '../reviews/entities/review.entity';
import { RiskScore } from '../risk/entities/risk-score.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'safescope',
  entities: [Report, Classification, AuditLog, Review, RiskScore, CorrectiveAction],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: true,
});
