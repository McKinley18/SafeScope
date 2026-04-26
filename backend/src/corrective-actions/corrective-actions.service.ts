import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CorrectiveAction } from './entities/corrective-action.entity';
import { CreateCorrectiveActionDto, CloseCorrectiveActionDto } from './dto/corrective-action.dto';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CorrectiveActionsService {
  constructor(
    @InjectRepository(CorrectiveAction)
    private actionRepo: Repository<CorrectiveAction>,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) {}

  private getAuthContext(authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Missing authorization token');

    const secret = process.env.JWT_SECRET || 'safescope_dev_secret_change_me';

    try {
      return jwt.verify(token, secret) as {
        sub: string;
        email: string;
        tenantId: string;
        role: string;
      };
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }

  private buildFilter(statusCode?: string, priorityCode?: string, tenantId?: string, assignedToUserId?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (assignedToUserId) where.assignedToUserId = assignedToUserId;
    if (statusCode) where.statusCode = statusCode;
    if (priorityCode) where.priorityCode = priorityCode;
    return where;
  }

  async findAll(
    authHeader: string,
    options: { page: number; limit: number; statusCode?: string; priorityCode?: string; assignedToMe?: boolean },
  ): Promise<{ data: CorrectiveAction[], meta: { total: number, page: number, limit: number } }> {
    const auth = this.getAuthContext(authHeader);
    const { page, limit, statusCode, priorityCode, assignedToMe } = options;
    const where = this.buildFilter(statusCode, priorityCode, auth.tenantId, assignedToMe ? auth.sub : undefined);

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

  async create(authHeader: string, dto: CreateCorrectiveActionDto) {
    const auth = this.getAuthContext(authHeader);
    const count = await this.actionRepo.count();
    const displayId = `ACT-${String(count + 2001).padStart(4, '0')}`;

    const action = this.actionRepo.create({
      ...dto,
      tenantId: auth.tenantId,
      ownerUserId: auth.sub,
      displayId,
    });
    const saved = await this.actionRepo.save(action);
    await this.auditService.log({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      entityType: 'CORRECTIVE_ACTION',
      entityId: saved.id,
      actionCode: 'ACTION_CREATED',
      afterJson: saved,
    });

    if (saved.assignedToUserId) {
      await this.notificationsService.create({
        tenantId: auth.tenantId,
        userId: saved.assignedToUserId,
        type: 'assigned_action',
        title: 'New corrective action assigned',
        message: saved.title || 'A corrective action has been assigned to you.',
        entityType: 'CORRECTIVE_ACTION',
        entityId: saved.id,
      });
    }

    return saved;
  }

  async updateStatus(
    authHeader: string,
    id: string,
    body: { statusCode: 'open' | 'in_progress' | 'closed' | 'cancelled'; closureNotes?: string },
  ) {
    const auth = this.getAuthContext(authHeader);

    const action = await this.actionRepo.findOne({ where: { id, tenantId: auth.tenantId } });
    if (!action) throw new Error('Action not found');

    const before = { ...action };
    action.statusCode = body.statusCode;

    if (body.statusCode === 'closed') {
      action.closureNotes = body.closureNotes || action.closureNotes;
      action.verifiedAt = new Date();
      action.verifiedByUserId = auth.sub;
    }

    const updated = await this.actionRepo.save(action);

    await this.auditService.log({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      entityType: 'CORRECTIVE_ACTION',
      entityId: updated.id,
      actionCode: 'ACTION_STATUS_UPDATED',
      beforeJson: before,
      afterJson: updated,
    });

    if (updated.assignedToUserId && before.statusCode !== updated.statusCode) {
      await this.notificationsService.create({
        tenantId: auth.tenantId,
        userId: updated.assignedToUserId,
        type: 'system',
        title: 'Corrective action status updated',
        message: `${updated.title || 'Corrective action'} is now ${updated.statusCode}.`,
        entityType: 'CORRECTIVE_ACTION',
        entityId: updated.id,
      });
    }

    return updated;
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
