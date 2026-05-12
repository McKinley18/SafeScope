import { DataSource } from 'typeorm';
import { dataSource } from '../../database/data-source';
import { seedStandards } from '../standards-seed.service';

async function run() {
  const ds = await dataSource.initialize();
  await seedStandards(ds);
  await ds.destroy();
}
run();
