import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>,
  ) {}

  create(task: Partial<Task>) {
    return this.repo.save(task);
  }

  findAll() {
    return this.repo.find();
  }
}
