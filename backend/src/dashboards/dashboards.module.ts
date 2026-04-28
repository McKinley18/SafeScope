import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CorrectiveAction])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardsModule {}
