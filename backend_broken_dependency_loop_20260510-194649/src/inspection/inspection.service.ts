import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inspection } from './inspection.entity';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private repo: Repository<Inspection>,
  ) {}

  async create(data: any) {
    const inspection = this.repo.create({
      title: data.title,
      hazards: data.hazards.map((h) => ({
        description: h.hazard,
        severity: h.severity,
      })),
    });

    return this.repo.save(inspection);
  }

  findAll() {
    return this.repo.find({
      relations: ['hazards'],
      order: { createdAt: 'DESC' },
    });
  }
}
