import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafeScopeSupervisorValidation } from './supervisor-validation.entity';

@Injectable()
export class SupervisorValidationService {
  constructor(
    @InjectRepository(SafeScopeSupervisorValidation)
    private readonly validationRepo: Repository<SafeScopeSupervisorValidation>,
  ) {}

  async createValidation(input: Partial<SafeScopeSupervisorValidation>) {
    const validation = this.validationRepo.create(input);
    return this.validationRepo.save(validation);
  }

  async getValidationHistory(reasoningSnapshotId: string) {
    return this.validationRepo.find({
      where: { reasoningSnapshotId },
      order: { createdAt: 'DESC' },
    });
  }
}
