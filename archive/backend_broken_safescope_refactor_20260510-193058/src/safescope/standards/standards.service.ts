import { Injectable } from '@nestjs/common';

@Injectable()
export class StandardsService {
  private standards = [];

  findAll() {
    return this.standards;
  }

  load(seed) {
    this.standards = seed;
  }
}
