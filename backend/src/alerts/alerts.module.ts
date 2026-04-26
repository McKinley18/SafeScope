import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AlertsService } from './alerts.service';

@Module({
  imports: [TypeOrmModule.forFeature([CorrectiveAction]), NotificationsModule],
  providers: [AlertsService],
})
export class AlertsModule {}
