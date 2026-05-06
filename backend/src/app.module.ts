import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/task.module';

// ⛔ Do NOT manually import entities here when using glob pattern

@Module({
  imports: [
    // ENV
    ConfigModule.forRoot({ isGlobal: true }),

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection (Render/Postgres)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),

        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,

        synchronize: true, // OK for now (disable in production later)

        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    // App modules
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
