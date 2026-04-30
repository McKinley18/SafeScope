import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardsController } from './standards.controller';
import { StandardsService } from './standards.service';
import { Standard } from './entities/standard.entity';
import { StandardMatchFeedback } from './entities/standard-match-feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Standard, StandardMatchFeedback])],
  controllers: [StandardsController],
  providers: [StandardsService],
  exports: [StandardsService],
})
export class StandardsModule {}
