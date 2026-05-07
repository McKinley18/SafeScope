import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ReportsModule } from './reports/reports.module';
import { TaskModule } from './tasks/task.module';
import { AuthModule } from './auth/auth.module';
import { StandardsModule } from './standards/standards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'mckinley',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'sentinel_dev',

      autoLoadEntities: true,

      synchronize: true, // OK for dev ONLY

      logging: false,
    }),

    ReportsModule,
    TaskModule,
    AuthModule,
    StandardsModule, // 🔥 REQUIRED
  ],
})
export class AppModule {}
