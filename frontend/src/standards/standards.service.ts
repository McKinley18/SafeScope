import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standard } from './standard.entity';

@Injectable()
export class StandardsService {
  constructor(
    @InjectRepository(Standard)
    private repo: Repository<Standard>,
  ) {}

  async seedInitial() {
    const count = await this.repo.count();
    if (count > 0) return;

    await this.repo.save([
      {
        citation: '56.11012',
        title: 'Protection of openings',
        text: 'Openings above, below, or near travelways shall be protected.',
        category: 'Fall Protection',
      },
      {
        citation: '56.12004',
        title: 'Electrical conductors exposed',
        text: 'Electrical conductors shall be insulated or protected.',
        category: 'Electrical',
      },
    ]);
  }

  findByCitations(citations: string[]) {
    return this.repo.find({
      where: citations.map(c => ({ citation: c })),
    });
  }
}
