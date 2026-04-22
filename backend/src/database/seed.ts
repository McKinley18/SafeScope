import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSource } from './data-source';
import { ClassificationRule } from '../taxonomy/entities/rule.entity';

async function seed() {
  const ds: DataSource = await dataSource.initialize();

  try {
    const ruleRepo = ds.getRepository(ClassificationRule);

    const existing = await ruleRepo.findOne({
      where: { code: 'fall_protection_missing' },
    });

    if (!existing) {
      await ruleRepo.save(
        ruleRepo.create({
          code: 'fall_protection_missing',
          severity: 5,
          keywords: ['fall protection', 'unguarded edge', 'open edge', 'no harness'],
          isActive: true,
        }),
      );
      console.log('Seeded classification rule: fall_protection_missing');
    } else {
      console.log('Classification rule already exists: fall_protection_missing');
    }

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await ds.destroy();
  }
}

seed();
