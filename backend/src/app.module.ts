import { SafescopeV2Module } from './safescope-v2/safescope-v2.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { StandardsModule } from './standards/standards.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SitesModule } from './sites/sites.module';
import { HealthModule } from './health/health.module';
import { RegulatoryModule } from './regulatory/regulatory.module';
import { ActionEngineModule } from './action-engine/action-engine.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { GovernanceModule } from './governance/governance.module';
import { OutcomesModule } from './outcomes/outcomes.module';
import { TransparencyModule } from './transparency/transparency.module';

@Module({
  imports: [SafescopeV2Module, 
    // 🔷 ENVIRONMENT CONFIGURATION: IT standard for secret management
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [SafescopeV2Module, ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // 🔷 DANGER: Keep true for dev, but IT departments require false for production
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    AuthModule,
    ReportsModule,
    StandardsModule,
    OrganizationsModule,
    SitesModule,
    HealthModule,
    RegulatoryModule,
    ActionEngineModule,
    IntelligenceModule,
    GovernanceModule,
    OutcomesModule,
    TransparencyModule,
  ],
})
export class AppModule {}
