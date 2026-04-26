import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { WorkspaceInvite } from './entities/workspace-invite.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, WorkspaceInvite]), EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
