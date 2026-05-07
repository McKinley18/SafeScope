import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // =========================
  // 🔐 PASSWORD POLICY
  // =========================
  validatePassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Must include uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Must include lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Must include number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new BadRequestException('Must include special character');
    }
  }

  // =========================
  // 🧾 REGISTER
  // =========================
  async register(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await this.usersRepo.findOne({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    this.validatePassword(password);

    const hashed = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      email: normalizedEmail,
      password: hashed,
    });

    await this.usersRepo.save(user);

    return { message: 'User created' };
  }

  // =========================
  // 🔑 LOGIN
  // =========================
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.usersRepo.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  // =========================
  // 🔁 REQUEST PASSWORD RESET
  // =========================
  async requestPasswordReset(email: string) {
    if (!email) {
      return { message: 'If email exists, reset sent' };
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.usersRepo.findOne({
      where: { email: normalizedEmail },
    });

    // 🔒 Prevent user enumeration
    if (!user) {
      return { message: 'If email exists, reset sent' };
    }

    const token = randomBytes(32).toString('hex');

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    await this.usersRepo.save(user);

    // ⚠️ Replace with email service later
    console.log(
      `RESET LINK: http://localhost:3000/reset-password?token=${token}`,
    );

    return { message: 'If email exists, reset sent' };
  }

  // =========================
  // 🔁 RESET PASSWORD
  // =========================
  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password required');
    }

    const user = await this.usersRepo.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    this.validatePassword(newPassword);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.usersRepo.save(user);

    return { message: 'Password reset successful' };
  }
}
