import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorrectiveAction } from './entities/corrective-action.entity';
import { CreateCorrectiveActionDto, CloseCorrectiveActionDto } from './dto/corrective-action.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CorrectiveActionsService {
  constructor(
    @InjectRepository(CorrectiveAction)
    private actionRepo: Repository<CorrectiveAction>,
    private auditService: AuditService,
  ) {}

  private buildFilter(statusCode?: string, priorityCode?: string) {
    const where: any = {};
    if (statusCode) where.statusCode = statusCode;
    if (priorityCode) where.priorityCode = priorityCode;
    return where;
  }

  async findAll(options: { page: number; limit: number; statusCode?: string; priorityCode?: string }): Promise<{ data: CorrectiveAction[], meta: { total: number, page: number, limit: number } }> {
    const { page, limit, statusCode, priorityCode } = options;
    const where = this.buildFilter(statusCode, priorityCode);

    const [data, total] = await this.actionRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: { total, page, limit }
    };
  }

  async export(statusCode?: string, priorityCode?: string) {
    const where = this.buildFilter(statusCode, priorityCode);
    return this.actionRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateCorrectiveActionDto) {
    const action = this.actionRepo.create(dto);
    const saved = await this.actionRepo.save(action);
    await this.auditService.log({
      entityType: 'CORRECTIVE_ACTION',
      entityId: saved.id,
      actionCode: 'ACTION_CREATED',
      afterJson: saved,
    });
    return saved;
  }

  async close(id: string, dto: CloseCorrectiveActionDto) {
    const action = await this.actionRepo.findOne({ where: { id } });
    if (!action) throw new Error('Action not found');
    
    const before = { ...action };
    action.statusCode = 'closed';
    action.closureNotes = dto.closureNotes;
    action.verifiedAt = new Date();
    const updated = await this.actionRepo.save(action);

    await this.auditService.log({
      entityType: 'CORRECTIVE_ACTION',
      entityId: updated.id,
      actionCode: 'ACTION_CLOSED',
      beforeJson: before,
      afterJson: updated,
    });
    return updated;
  }
}
