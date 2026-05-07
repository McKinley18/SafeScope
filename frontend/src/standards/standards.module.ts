import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Standard } from './standard.entity';
import { StandardsService } from './standards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Standard])],
  providers: [StandardsService],
  exports: [StandardsService],
})
export class StandardsModule {}
