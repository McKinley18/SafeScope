import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { AuditModule } from './audit/audit.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RiskModule } from './risk/risk.module';
import { CorrectiveActionsModule } from './corrective-actions/corrective-actions.module';
import { AuditSessionModule } from './audit-session/audit-session.module';

import { Report } from './reports/entities/report.entity';
import { ReportAttachment } from './reports/entities/attachment.entity';
import { Classification } from './classifications/entities/classification.entity';
import { AuditLog } from './audit/entities/audit-log.entity';
import { Review } from './reviews/entities/review.entity';
import { RiskScore } from './risk/entities/risk-score.entity';
import { CorrectiveAction } from './corrective-actions/entities/corrective-action.entity';
import { ClassificationRule } from './taxonomy/entities/rule.entity';
import { ClassificationRuleVersion } from './taxonomy/entities/rule-version.entity';
import { AuditSession } from './audit-session/audit-session.entity';
import { AuditEntry } from './audit-session/audit-entry.entity';
import { AuditEntryAttachment } from './audit-session/entities/audit-entry-attachment.entity';
import { AuditEntryFinding } from './audit-session/entities/audit-entry-finding.entity';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          Report,
          ReportAttachment,
          Classification,
          AuditLog,
          Review,
          RiskScore,
          CorrectiveAction,
          ClassificationRule,
          ClassificationRuleVersion,
          AuditSession,
          AuditEntry,
          AuditEntryAttachment,
          AuditEntryFinding,
        ],
        synchronize: false,
      }),
    }),
    HealthModule,
    ReportsModule,
    TaxonomyModule,
    DashboardsModule,
    ClassificationsModule,
    AuditModule,
    ReviewsModule,
    RiskModule,
    CorrectiveActionsModule,
    AuditSessionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
