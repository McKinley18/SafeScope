import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private orgService: OrganizationsService,
  ) {}

  async register(dto: RegisterDto & { inviteToken?: string }) {
    const { email, password, name, type, inviteToken } = dto;

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already exists');

    let organizationId = null;
    let role = 'Auditor';
    let finalType = type;

    // 🔷 HANDSHAKE: IF INVITE TOKEN PROVIDED
    if (inviteToken) {
      const invite = await this.orgService.useInvitation(inviteToken);
      organizationId = invite.organizationId;
      role = invite.role;
      finalType = 'company'; // Locked to company tier
    }

    if (!organizationId) {
      const org = await this.orgService.create({
        name: `${name || email.split('@')[0]}'s Organization`,
      } as any);

      organizationId = org.id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      type: finalType,
      role,
      organizationId,
    });

    await this.userRepo.save(user);

    return {
      message: 'User created successfully',
      userId: user.id,
      organizationId
    };
  }

  async verifyInvite(token: string) {
    return await this.orgService.verifyInvitation(token);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      type: user.type,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      deletedAt: user.deletedAt,
      organizationId: user.organizationId
    });

    return {
      message: 'Login successful',
      token,
    };
  }
}
