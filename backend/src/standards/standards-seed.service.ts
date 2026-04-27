import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standard } from './entities/standard.entity';
import { standardSeeds } from './seeds/standards.seed';

@Injectable()
export class StandardsSeedService {
  constructor(
    @InjectRepository(Standard)
    private standardRepo: Repository<Standard>,
  ) {}

  async seedDefaults() {
    let created = 0;
    let updated = 0;

    for (const item of standardSeeds) {
      const existing = await this.standardRepo.findOne({
        where: { citation: item.citation },
      });

      if (existing) {
        await this.standardRepo.save(
          this.standardRepo.create({
            ...existing,
            ...item,
            lastSyncedAt: new Date(),
          }),
        );
        updated += 1;
      } else {
        await this.standardRepo.save(
          this.standardRepo.create({
            ...item,
            lastSyncedAt: new Date(),
          } as any),
        );
        created += 1;
      }
    }

    return { ok: true, created, updated, total: standardSeeds.length };
  }
}
