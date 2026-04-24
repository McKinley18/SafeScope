import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private sign(user: User) {
    const secret = process.env.JWT_SECRET || 'safescope_dev_secret_change_me';

    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role,
      },
      secret,
      { expiresIn: '7d' },
    );
  }

  async register(dto: { email: string; password: string; tenantId?: string }) {
    const count = await this.userRepo.count();
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.save(
      this.userRepo.create({
        displayId: `USR-${String(count + 1001).padStart(4, '0')}`,
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        tenantId: dto.tenantId || 'default',
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
        role: user.role,
      },
    };
  }

  async resetUsers() {
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
        role: user.role,
      },
    };
  }
}
