import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { Invitation } from './entities/invitation.entity';
import * as crypto from 'crypto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    @InjectRepository(Invitation)
    private inviteRepo: Repository<Invitation>,
  ) {}

  async findOne(id: string) {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async createInvitation(orgId: string, email: string, role: string) {
    const token = crypto.randomBytes(16).toString('hex');
    const invite = this.inviteRepo.create({
      email,
      token,
      role,
      organizationId: orgId
    });
    return await this.inviteRepo.save(invite);
  }

  async verifyInvitation(token: string) {
    const invite = await this.inviteRepo.findOne({ 
      where: { token, isUsed: false },
      relations: ['organization']
    });
    if (!invite) throw new NotFoundException('Invalid or expired invitation token');
    return invite;
  }

  async useInvitation(token: string) {
    const invite = await this.verifyInvitation(token);
    invite.isUsed = true;
    await this.inviteRepo.save(invite);
    return invite;
  }
}
