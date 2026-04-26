import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { WorkspaceInvite } from './entities/workspace-invite.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(WorkspaceInvite)
    private inviteRepo: Repository<WorkspaceInvite>,
  ) {}

  private sign(user: User) {
    const secret = process.env.JWT_SECRET || 'safescope_dev_secret_change_me';

    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        tenantId: user.tenantId,
        workspaceType: user.workspaceType,
        companyName: user.companyName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      secret,
      { expiresIn: '7d' },
    );
  }

  async register(dto: { email: string; password: string; tenantId?: string; workspaceType?: 'individual' | 'company'; companyName?: string; firstName?: string; lastName?: string }) {
    const count = await this.userRepo.count();
    const workspaceType = dto.workspaceType || 'individual';
    const tenantId = dto.tenantId || 'default';

    if (workspaceType === 'individual') {
      const existingPersonalWorkspace = await this.userRepo.count({
        where: { tenantId },
      });

      if (existingPersonalWorkspace >= 1) {
        throw new UnauthorizedException('This personal workspace already has an account.');
      }
    }

    if (workspaceType === 'company') {
      const existingCompanyUsers = await this.userRepo.count({
        where: { tenantId },
      });

      const workspaceOwner = await this.userRepo.findOne({
        where: { tenantId, role: 'owner' as any },
      });

      const seatLimit = workspaceOwner?.workspaceSeatLimit || 10;

      if (existingCompanyUsers >= seatLimit) {
        throw new UnauthorizedException(`Company workspace user limit reached. Current limit is ${seatLimit} users.`);
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.save(
      this.userRepo.create({
        displayId: `USR-${String(count + 1001).padStart(4, '0')}`,
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        tenantId,
        workspaceType,
        workspaceSeatLimit: workspaceType === 'company' ? 10 : 1,
        companyName: dto.companyName || null,
        firstName: dto.firstName || null,
        lastName: dto.lastName || null,
        role: count === 0 ? 'owner' : 'inspector',
      }),
    );

    return {
      token: this.sign(user),
      user: {
        id: user.id,
        displayId: user.displayId,
        email: user.email,
        tenantId: user.tenantId,
        workspaceType: user.workspaceType,
        companyName: user.companyName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

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

  async getWorkspaceUsers(authHeader: string) {
    const auth = this.getAuthContext(authHeader);

    const users = await this.userRepo.find({
      where: { tenantId: auth.tenantId },
      order: { createdAt: 'ASC' },
    });

    return {
      users: users.map((user) => ({
        id: user.id,
        displayId: user.displayId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
        role: user.role,
        workspaceType: user.workspaceType,
        companyName: user.companyName,
      })),
    };
  }

  async createInvite(
    authHeader: string,
    dto: { email: string; role?: 'admin' | 'manager' | 'inspector' | 'viewer' },
  ) {
    const auth = this.getAuthContext(authHeader);

    if (!['owner', 'admin'].includes(auth.role)) {
      throw new UnauthorizedException('Only owners and admins can invite users.');
    }

    const inviter = await this.userRepo.findOne({ where: { id: auth.sub } });
    if (!inviter || inviter.workspaceType !== 'company') {
      throw new UnauthorizedException('Invites are only available for company workspaces.');
    }

    const currentUsers = await this.userRepo.count({ where: { tenantId: inviter.tenantId } });
    const pendingInvites = await this.inviteRepo.count({
      where: { tenantId: inviter.tenantId, status: 'pending' as any },
    });

    if (currentUsers + pendingInvites >= inviter.workspaceSeatLimit) {
      throw new UnauthorizedException(`Workspace seat limit reached. Current limit is ${inviter.workspaceSeatLimit} users.`);
    }

    const inviteToken = crypto.randomBytes(24).toString('hex');
    const email = dto.email.toLowerCase().trim();

    const invite = await this.inviteRepo.save(
      this.inviteRepo.create({
        inviteToken,
        email,
        tenantId: inviter.tenantId,
        companyName: inviter.companyName || inviter.tenantId,
        role: dto.role || 'inspector',
        invitedByUserId: inviter.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      }),
    );

    return {
      ok: true,
      message: 'Invite created.',
      inviteToken,
      invite,
    };
  }

  async acceptInvite(dto: { inviteToken: string; firstName: string; lastName: string; password: string }) {
    const invite = await this.inviteRepo.findOne({
      where: { inviteToken: dto.inviteToken, status: 'pending' as any },
    });

    if (!invite || invite.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Invalid or expired invite.');
    }

    if (!this.validatePassword(dto.password)) {
      throw new UnauthorizedException(
        'Password must be at least 8 characters and include letters, numbers, and a special character.',
      );
    }

    const existingUser = await this.userRepo.findOne({
      where: { email: invite.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('A user with this email already exists.');
    }

    const owner = await this.userRepo.findOne({
      where: { tenantId: invite.tenantId, role: 'owner' as any },
    });

    const currentUsers = await this.userRepo.count({ where: { tenantId: invite.tenantId } });
    const seatLimit = owner?.workspaceSeatLimit || 10;

    if (currentUsers >= seatLimit) {
      throw new UnauthorizedException(`Workspace seat limit reached. Current limit is ${seatLimit} users.`);
    }

    const count = await this.userRepo.count();
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.save(
      this.userRepo.create({
        displayId: `USR-${String(count + 1001).padStart(4, '0')}`,
        email: invite.email,
        passwordHash,
        tenantId: invite.tenantId,
        workspaceType: 'company',
        workspaceSeatLimit: seatLimit,
        companyName: invite.companyName,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: invite.role,
      }),
    );

    invite.status = 'accepted';
    await this.inviteRepo.save(invite);

    return {
      token: this.sign(user),
      user: {
        id: user.id,
        displayId: user.displayId,
        email: user.email,
        tenantId: user.tenantId,
        workspaceType: user.workspaceType,
        companyName: user.companyName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private hashResetToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private validatePassword(password: string) {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  async requestPasswordReset(dto: { email: string }) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.userRepo.findOne({
      where: { email: normalizedEmail },
    });

    const safeResponse = {
      ok: true,
      message: 'If an account exists, password reset instructions have been created.',
    };

    if (!user) return safeResponse;

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetTokenHash = this.hashResetToken(token);
    user.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await this.userRepo.save(user);

    return {
      ...safeResponse,
      devResetToken: process.env.NODE_ENV === 'production' ? undefined : token,
    };
  }

  async confirmPasswordReset(dto: { email: string; token: string; newPassword: string }) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    if (!this.validatePassword(dto.newPassword)) {
      throw new UnauthorizedException(
        'Password must be at least 8 characters and include letters, numbers, and a special character.',
      );
    }

    const user = await this.userRepo.findOne({
      where: { email: normalizedEmail },
    });

    if (
      !user ||
      !user.passwordResetTokenHash ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const incomingHash = this.hashResetToken(dto.token);

    if (incomingHash !== user.passwordResetTokenHash) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;

    await this.userRepo.save(user);

    return {
      ok: true,
      message: 'Password reset successful. Please sign in.',
    };
  }

  async resetUsers() {
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Reset not allowed in production.');
    }

    await this.userRepo.clear();
    return { ok: true, message: 'All users deleted.' };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return {
      token: this.sign(user),
      user: {
        id: user.id,
        displayId: user.displayId,
        email: user.email,
        tenantId: user.tenantId,
        workspaceType: user.workspaceType,
        companyName: user.companyName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
