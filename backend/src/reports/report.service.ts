import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './report.entity';
import { Task } from '../tasks/task.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(data: any) {
    // 🔹 Save report
    const report = this.reportRepo.create({
      hazardType: data.hazardType,
      description: data.description,
      environment: data.environment,
      equipment: data.equipment,
      risk: data.calculatedRisk,
      matches: data.matches,
    });

    const saved = await this.reportRepo.save(report);

    // 🔹 Generate tasks from AI recommendations
    const tasks = (data.matches || []).flatMap((m: any) =>
      (m.standard.recommendedActions || []).map((action: string) => ({
        reportId: saved.id,
        description: action,
      }))
    );

    if (tasks.length) {
      await this.taskRepo.save(tasks);
    }

    return saved;
  }

  async getAll() {
    return this.reportRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
}
