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
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    HealthModule, ReportsModule, TaxonomyModule, DashboardsModule, ClassificationsModule, AuditModule,
    ReviewsModule, RiskModule, CorrectiveActionsModule, AuditSessionModule, AuthModule, AlertsModule,
    StandardsModule, RegulatoryModule, ApplicableStandardsModule, NotificationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
