import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      email,
      password: hashedPassword,
    });

    await this.usersRepo.save(user);

    return {
      message: 'User created successfully',
    };
  }
}
