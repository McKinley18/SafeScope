"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const attachment_entity_1 = require("./reports/entities/attachment.entity");
const audit_entry_finding_entity_1 = require("./audit-session/entities/audit-entry-finding.entity");
const audit_entry_attachment_entity_1 = require("./audit-session/entities/audit-entry-attachment.entity");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const health_module_1 = require("./health/health.module");
const reports_module_1 = require("./reports/reports.module");
const analytics_module_1 = require("./analytics/analytics.module");
const taxonomy_module_1 = require("./taxonomy/taxonomy.module");
const dashboards_module_1 = require("./dashboards/dashboards.module");
const classifications_module_1 = require("./classifications/classifications.module");
const audit_module_1 = require("./audit/audit.module");
const reviews_module_1 = require("./reviews/reviews.module");
const risk_module_1 = require("./risk/risk.module");
const corrective_actions_module_1 = require("./corrective-actions/corrective-actions.module");
const audit_session_module_1 = require("./audit-session/audit-session.module");
const auth_module_1 = require("./auth/auth.module");
const alerts_module_1 = require("./alerts/alerts.module");
const notifications_module_1 = require("./notifications/notifications.module");
const standards_module_1 = require("./standards/standards.module");
const regulatory_module_1 = require("./regulatory/regulatory.module");
const applicable_standards_module_1 = require("./applicable-standards/applicable-standards.module");
const match_engine_module_1 = require("./match-engine/match-engine.module");
const intelligence_module_1 = require("./intelligence-framework/intelligence.module");
const hazard_taxonomy_entity_1 = require("./intelligence-framework/entities/hazard-taxonomy.entity");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [require("./control-verifications/control-verifications.module").ControlVerificationsModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [require("./control-verifications/control-verifications.module").ControlVerificationsModule, config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const databaseUrl = configService.get('DATABASE_URL');
                    const normalizedDatabaseUrl = databaseUrl && !databaseUrl.includes('sslmode=')
                        ? `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require`
                        : databaseUrl;
                    return {
                        type: 'postgres',
                        ...(normalizedDatabaseUrl
                            ? { url: normalizedDatabaseUrl, ssl: { rejectUnauthorized: false } }
                            : {
                                host: configService.get('DATABASE_HOST'),
                                port: Number(configService.get('DATABASE_PORT') || 5432),
                                username: configService.get('DATABASE_USER'),
                                password: configService.get('DATABASE_PASSWORD'),
                                database: configService.get('DATABASE_NAME'),
                                ssl: configService.get('NODE_ENV') === 'production'
                                    ? { rejectUnauthorized: false }
                                    : false,
                            }),
                        entities: [require("./control-verifications/entities/control-verification.entity").ControlVerification, __dirname + '/**/*.entity{.ts,.js}', hazard_taxonomy_entity_1.HazardTaxonomy, audit_entry_attachment_entity_1.AuditEntryAttachment, audit_entry_finding_entity_1.AuditEntryFinding, attachment_entity_1.ReportAttachment],
                        synchronize: true,
                    };
                },
            }),
            health_module_1.HealthModule, reports_module_1.ReportsModule,
            analytics_module_1.AnalyticsModule, taxonomy_module_1.TaxonomyModule, dashboards_module_1.DashboardsModule, classifications_module_1.ClassificationsModule, audit_module_1.AuditModule,
            reviews_module_1.ReviewsModule, risk_module_1.RiskModule, corrective_actions_module_1.CorrectiveActionsModule, audit_session_module_1.AuditSessionModule, auth_module_1.AuthModule, alerts_module_1.AlertsModule,
            standards_module_1.StandardsModule, regulatory_module_1.RegulatoryModule, applicable_standards_module_1.ApplicableStandardsModule, match_engine_module_1.MatchEngineModule, intelligence_module_1.IntelligenceLibraryModule, notifications_module_1.NotificationsModule,],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map