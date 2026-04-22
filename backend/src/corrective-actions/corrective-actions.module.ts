import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorrectiveActionsController } from './corrective-actions.controller';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CorrectiveAction } from './entities/corrective-action.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([CorrectiveAction]), AuditModule],
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
