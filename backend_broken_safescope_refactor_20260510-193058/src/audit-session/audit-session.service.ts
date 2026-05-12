import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditSession } from './audit-session.entity';
import { AuditEntry } from './audit-entry.entity';

@Injectable()
export class AuditSessionService {
  constructor(
    @InjectRepository(AuditSession)
    private readonly auditSessionRepo: Repository<AuditSession>,
    @InjectRepository(AuditEntry)
    private readonly auditEntryRepo: Repository<AuditEntry>,
  ) {}

  async createSession(dto: Partial<AuditSession>) {
    const session = this.auditSessionRepo.create({
      status: 'draft',
      standardsMode: dto.standardsMode || 'msha_hybrid',
      ...dto,
    });
    return this.auditSessionRepo.save(session);
  }

  async addEntry(sessionId: string, dto: Partial<AuditEntry>) {
    const session = await this.auditSessionRepo.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Audit session not found');
    }

    const entry = this.auditEntryRepo.create({
      auditSessionId: sessionId,
      ...dto,
    });

    return this.auditEntryRepo.save(entry);
  }

  async publish(sessionId: string) {
    const session = await this.auditSessionRepo.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Audit session not found');
    }

    session.status = 'published';
    session.publishedAt = new Date();
    return this.auditSessionRepo.save(session);
  }

  async findAll() {
    return this.auditSessionRepo.find();
  }

  async findOne(id: string) {
    const session = await this.auditSessionRepo.findOne({
      where: { id },
      relations: ['entries'],
    });

    if (!session) {
      throw new NotFoundException('Audit session not found');
    }

    return session;
  }
}
