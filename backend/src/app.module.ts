import { ReportAttachment } from './reports/entities/attachment.entity';
import { AuditEntryFinding } from './audit-session/entities/audit-entry-finding.entity';
import { AuditEntryAttachment } from './audit-session/entities/audit-entry-attachment.entity';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
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
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StandardsModule } from './standards/standards.module';
import { RegulatoryModule } from './regulatory/regulatory.module';
import { ApplicableStandardsModule } from './applicable-standards/applicable-standards.module';
import { MatchEngineModule } from './match-engine/match-engine.module';
import { IntelligenceLibraryModule } from './intelligence-framework/intelligence.module';
import { HazardTaxonomy } from './intelligence-framework/entities/hazard-taxonomy.entity';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

// ... (other imports)

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const normalizedDatabaseUrl =
          databaseUrl && !databaseUrl.includes('sslmode=')
            ? `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require`
            : databaseUrl;

        return {
          type: 'postgres',
          ...(normalizedDatabaseUrl
            ? { url: normalizedDatabaseUrl, ssl: { rejectUnauthorized: false } }
            : {
                host: configService.get<string>('DATABASE_HOST'),
                port: Number(configService.get<string>('DATABASE_PORT') || 5432),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                ssl:
                  configService.get<string>('NODE_ENV') === 'production'
                    ? { rejectUnauthorized: false }
                    : false,
              }),
          entities: [__dirname + '/**/*.entity{.ts,.js}', HazardTaxonomy, AuditEntryAttachment, AuditEntryFinding, ReportAttachment],
          synchronize: true,
        };
      },
    }),
    HealthModule, ReportsModule, TaxonomyModule, DashboardsModule, ClassificationsModule, AuditModule,
    ReviewsModule, RiskModule, CorrectiveActionsModule, AuditSessionModule, AuthModule, AlertsModule,
    StandardsModule, RegulatoryModule, ApplicableStandardsModule, MatchEngineModule, IntelligenceLibraryModule, NotificationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
