import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; // ✅ FIXED
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

  validatePassword(password: string) {
    if (password.length < 8) throw new BadRequestException('Min 8 chars');
    if (!/[A-Z]/.test(password)) throw new BadRequestException('Uppercase required');
    if (!/[a-z]/.test(password)) throw new BadRequestException('Lowercase required');
    if (!/[0-9]/.test(password)) throw new BadRequestException('Number required');
    if (!/[^A-Za-z0-9]/.test(password)) throw new BadRequestException('Special char required');
  }

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('User exists');

    this.validatePassword(password);

    const hashed = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      email,
      password: hashed,
    });

    await this.usersRepo.save(user);

    return { message: 'User created' };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { access_token: token };
  }

  // 🔥 REQUEST RESET
  async requestPasswordReset(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) return { message: 'If email exists, reset sent' };

    const token = randomBytes(32).toString('hex');

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    await this.usersRepo.save(user);

    console.log(`RESET LINK: http://localhost:3000/reset-password?token=${token}`);

    return { message: 'Reset link generated (check backend logs)' };
  }

  // 🔥 RESET PASSWORD
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepo.findOne({
      where: { resetToken: token },
    });

    if (!user) throw new BadRequestException('Invalid token');

    if (user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token expired');
    }

    this.validatePassword(newPassword);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.usersRepo.save(user);

    return { message: 'Password reset successful' };
  }
}
