import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inspection } from './inspection.entity';

type CreateInspectionInput = {
  title: string;
  hazards: Array<{
    hazard: string;
    severity: string | number;
  }>;
};

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private repo: Repository<Inspection>,
  ) {}

  async create(data: CreateInspectionInput) {
    const inspection = this.repo.create({
      title: data.title,
    });

    inspection.hazards = data.hazards.map((h: CreateInspectionInput["hazards"][number]) => ({
      description: h.hazard,
      severity: String(h.severity),
    })) as unknown as Inspection["hazards"];

    return this.repo.save(inspection);
  }

  findAll() {
    return this.repo.find({
      relations: ['hazards'],
      order: { createdAt: 'DESC' },
    });
  }
}
