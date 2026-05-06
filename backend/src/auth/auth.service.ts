import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  validatePassword(password: string) {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    if (!hasUpper) {
      throw new BadRequestException('Password must include an uppercase letter');
    }

    if (!hasLower) {
      throw new BadRequestException('Password must include a lowercase letter');
    }

    if (!hasNumber) {
      throw new BadRequestException('Password must include a number');
    }

    if (!hasSpecial) {
      throw new BadRequestException('Password must include a special character');
    }
  }

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    this.validatePassword(password);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      email,
      password: hashedPassword,
    });

    await this.usersRepo.save(user);

    return { message: 'User created successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: token,
    };
  }
}
