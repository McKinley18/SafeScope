import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { XMLParser } from 'fast-xml-parser';
import { Standard } from '../entities/standard.entity';

const DATABASE_URL = process.env.DATABASE_URL;

const ds = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  ssl: DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
  entities: [Standard],
  synchronize: false,
});

const TARGETS: Array<{
  title: number;
  agencyCode: 'OSHA' | 'MSHA';
  scopeCode: 'general_industry' | 'construction' | 'mining';
  parts: string[];
}> = [
  { title: 29, agencyCode: 'OSHA', scopeCode: 'general_industry', parts: ['1910'] },
  { title: 29, agencyCode: 'OSHA', scopeCode: 'construction', parts: ['1926'] },
  { title: 30, agencyCode: 'MSHA', scopeCode: 'mining', parts: ['46', '47', '48', '50', '56', '57', '62', '75', '77'] },
];

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function textOf(value: any): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(textOf).join(' ');
  if (typeof value === 'object') return Object.entries(value)
    .filter(([key]) => !key.startsWith('@_'))
    .map(([, v]) => textOf(v))
    .join(' ');
  return '';
}

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function walk(node: any, visit: (node: any) => void) {
  if (!node || typeof node !== 'object') return;
  visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((item) => walk(item, visit));
    else if (typeof value === 'object') walk(value, visit);
  }
}

function extractSections(root: any) {
  const sections: any[] = [];

  walk(root, (node) => {
    const sectionNodes = asArray((node as any).DIV8).concat(asArray((node as any).SECTION));
    for (const section of sectionNodes) {
      const num = section?.HEAD ? clean(textOf(section.HEAD)) : '';
      const sectionNum = section?.['@_N'] || section?.['@_TYPE'] || num;
      const text = clean(textOf(section));
      if (text && /§|section|[0-9]/i.test(num || sectionNum)) {
        sections.push(section);
      }
    }
  });

  return sections;
}

function getPartFromCitation(citation: string) {
  const match = citation.match(/^(\d+)/);
  return match?.[1] || '';
}

function normalizeCitation(title: number, rawHead: string, attrs: any) {
  const n = attrs?.['@_N'] || '';
  const head = rawHead || '';
  const sectionMatch = `${n} ${head}`.match(/(\d{2,4}\.\d+[a-z0-9().-]*)/i);
  const section = sectionMatch?.[1];
  if (!section) return null;
  return title === 30 ? `30 CFR ${section}` : section;
}

function inferKeywords(text: string) {
  const dictionary = [
    'guard','machine','moving parts','conveyor','pulley','shaft','electrical','energized','wire',
    'lockout','tagout','confined space','excavation','trench','fall','ladder','stair','walkway',
    'catwalk','travelway','housekeeping','material','accumulation','slip','trip','ppe','respirator',
    'silica','dust','mobile equipment','truck','forklift','crane','rigging','hazard communication',
    'chemical','fire','explosion','egress','exit'
  ];

  const lower = text.toLowerCase();
  return dictionary.filter((word) => lower.includes(word)).slice(0, 25);
}

async function fetchXml(title: number) {
  const url = `https://www.govinfo.gov/bulkdata/ECFR/title-${title}/ECFR-title${title}.xml`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function run() {
  await ds.initialize();
  const repo = ds.getRepository(Standard);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });

  let inserted = 0;
  let updated = 0;

  for (const title of [29, 30]) {
    console.log(`Fetching Title ${title} eCFR XML...`);
    const xml = await fetchXml(title);
    const parsed = parser.parse(xml);
    const sections = extractSections(parsed);

    for (const section of sections) {
      const head = clean(textOf(section.HEAD));
      const citation = normalizeCitation(title, head, section);
      if (!citation) continue;

      const target = TARGETS.find((item) =>
        item.title === title &&
        item.parts.includes(getPartFromCitation(citation.replace('30 CFR ', '')))
      );

      if (!target) continue;

      const standardText = clean(textOf(section.P || section));
      if (!standardText || standardText.length < 20) continue;

      const existing = await repo.findOne({
        where: { agencyCode: target.agencyCode as any, citation },
      });

      const entity = existing || repo.create();
      entity.agencyCode = target.agencyCode as any;
      entity.citation = citation;
      entity.partNumber = getPartFromCitation(citation.replace('30 CFR ', ''));
      entity.title = head || citation;
      entity.standardText = standardText;
      entity.plainLanguageSummary = standardText.slice(0, 500);
      entity.scopeCode = target.scopeCode as any;
      entity.keywords = inferKeywords(`${head} ${standardText}`);
      entity.hazardCodes = [];
      entity.requiredControls = [];
      entity.severityWeight = 1;
      entity.isActive = true;

      await repo.save(entity);
      existing ? updated++ : inserted++;
    }
  }

  console.log(`eCFR ingestion complete. Inserted ${inserted}. Updated ${updated}.`);
  await ds.destroy();
}

run().catch(async (err) => {
  console.error(err);
  await ds.destroy().catch(() => undefined);
  process.exit(1);
});
