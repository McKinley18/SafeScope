import 'reflect-metadata';
import 'dotenv/config';
import { dataSource } from '../../database/data-source';
import { seedStandards } from './standards.seed';

async function main() {
  await dataSource.initialize();
  await seedStandards(dataSource);
  await dataSource.destroy();
  console.log('Standards seed complete');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
