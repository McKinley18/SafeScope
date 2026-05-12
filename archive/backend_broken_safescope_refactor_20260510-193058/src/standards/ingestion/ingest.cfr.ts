import { DataSource } from 'typeorm';
import { Standard } from '../standard.entity';
import * as fs from 'fs';
import * as path from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mckinley',
  password: '',
  database: 'sentinel_safety',
  entities: [Standard],
  synchronize: true,
});

function loadJSON(file: string) {
  const filePath = path.join(__dirname, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function upsert(repo, record) {
  const existing = await repo.findOne({
    where: { citation: record.citation, agency: record.agency },
  });

  if (existing) {
    await repo.update(existing.id, record);
    console.log(`🔄 Updated ${record.citation}`);
  } else {
    await repo.save(record);
    console.log(`✔ Inserted ${record.citation}`);
  }
}

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Standard);

  const datasets = ['msha.full.json', 'osha.full.json'];

  for (const file of datasets) {
    console.log(`\n📦 Processing ${file}`);

    const data = loadJSON(file);

    for (const record of data) {
      await upsert(repo, record);
    }
  }

  console.log('\n✅ FULL CFR INGESTION COMPLETE');
  process.exit(0);
}

run();
