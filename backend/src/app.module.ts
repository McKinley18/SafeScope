import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    // ENV
    ConfigModule.forRoot({ isGlobal: true }),

    // DATABASE (Render Postgres)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),

        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,

        synchronize: true,

        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    // MODULES
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
