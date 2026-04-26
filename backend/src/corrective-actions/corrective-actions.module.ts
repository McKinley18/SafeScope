import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorrectiveActionsController } from './corrective-actions.controller';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CorrectiveAction } from './entities/corrective-action.entity';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([CorrectiveAction]), AuditModule, NotificationsModule],
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
