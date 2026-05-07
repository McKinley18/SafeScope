import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Standard } from './standard.entity';
import { Feedback } from './feedback.entity';
import { StandardsService } from './standards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Standard, Feedback]),
  ],
  providers: [StandardsService],
  exports: [StandardsService],
})
export class StandardsModule {}
