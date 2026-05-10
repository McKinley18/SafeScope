import { Controller, Get, Patch, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';

@Controller('alerts')
export class AlertsController {
  constructor(
    @InjectRepository(Alert)
    private repo: Repository<Alert>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find({ relations: ['report'] });
  }

  @Patch(':id/acknowledge')
  async acknowledge(@Param('id') id: string) {
    const alert = await this.repo.findOne({ where: { id } });

    if (!alert) return { error: 'Not found' };

    alert.status = true;
    alert.statusAt = new Date().toISOString();

    return this.repo.save(alert);
  }
}
