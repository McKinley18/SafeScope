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

    // DATABASE
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: parseInt(config.get<string>('DATABASE_PORT') || '5432'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),

        // 🔥 THIS IS THE KEY LINE
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        synchronize: true, // OK for dev (turn off later)
      }),
    }),

    // MODULES
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
