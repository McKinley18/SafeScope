import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsModule } from './reports/reports.module';
import { StandardsModule } from './standards/standards.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'mckinley',
      password: '',
      database: 'sentinel_dev',
      autoLoadEntities: true,
      synchronize: true,
    }),

    StandardsModule,
    ReportsModule,
  ],
})
export class AppModule {}
