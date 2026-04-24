export type StandardMatch = {
  id: string;
  source: 'MSHA' | 'OSHA' | 'Company';
  citation: string;
  title: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
  rationale: string;
  keywords: string[];
};

type Rule = Omit<StandardMatch, 'confidence' | 'rationale'> & {
  phrases: string[];
};

const rules: Rule[] = [
  {
    id: 'msha-56-14107',
    source: 'MSHA',
    citation: '30 CFR 56.14107',
    title: 'Moving machine parts guarding',
    category: 'Machine Guarding',
    keywords: ['guard', 'unguarded', 'missing guard', 'pinch point', 'belt', 'pulley', 'conveyor'],
    phrases: ['missing guard', 'unguarded pulley', 'exposed belt', 'pinch point', 'conveyor guard'],
  },
  {
    id: 'msha-56-20003',
    source: 'MSHA',
    citation: '30 CFR 56.20003',
    title: 'Housekeeping',
    category: 'Housekeeping',
    keywords: ['housekeeping', 'debris', 'trash', 'material buildup', 'clutter', 'walkway'],
    phrases: ['poor housekeeping', 'blocked walkway', 'material buildup', 'trash accumulation'],
  },
  {
    id: 'msha-56-11001',
    source: 'MSHA',
    citation: '30 CFR 56.11001',
    title: 'Safe access',
    category: 'Access / Egress',
    keywords: ['access', 'egress', 'ladder', 'stairs', 'platform', 'walkway', 'blocked'],
    phrases: ['unsafe access', 'blocked access', 'damaged ladder', 'blocked egress'],
  },
  {
    id: 'msha-56-12032',
    source: 'MSHA',
    citation: '30 CFR 56.12032',
    title: 'Inspection and cover plates',
    category: 'Electrical',
    keywords: ['electrical', 'panel', 'cover', 'wire', 'junction box', 'exposed'],
    phrases: ['open electrical panel', 'missing cover', 'exposed wire', 'open junction box'],
  },
  {
    id: 'msha-56-20011',
    source: 'MSHA',
    citation: '30 CFR 56.20011',
    title: 'Barricades and warning signs',
    category: 'Barricades / Signage',
    keywords: ['barricade', 'warning', 'sign', 'tape', 'restricted', 'danger'],
    phrases: ['missing barricade', 'no warning sign', 'danger area not marked'],
  },
  {
    id: 'msha-56-14100',
    source: 'MSHA',
    citation: '30 CFR 56.14100',
    title: 'Safety defects examination',
    category: 'Equipment Inspection',
    keywords: ['defect', 'equipment', 'inspection', 'unsafe condition', 'defective'],
    phrases: ['equipment defect', 'unsafe equipment', 'safety defect'],
  },
];

export function matchStandards(input: string): StandardMatch[] {
  const text = input.toLowerCase().trim();
  if (!text) return [];

  const scored = rules
    .map((rule) => {
      let score = 0;
      const hits: string[] = [];

      for (const phrase of rule.phrases) {
        if (text.includes(phrase)) {
          score += 4;
          hits.push(phrase);
        }
      }

      for (const keyword of rule.keywords) {
        if (text.includes(keyword)) {
          score += 1;
          hits.push(keyword);
        }
      }

      if (score === 0) return null;

      const confidence =
        score >= 5 ? 'high' : score >= 2 ? 'medium' : 'low';

      return {
        ...rule,
        confidence,
        rationale: `Matched terms: ${Array.from(new Set(hits)).join(', ')}`,
        score,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 3);

  return scored.map(({ score, phrases, ...match }: any) => match);
}

// Future AI adapter can replace or supplement this function without changing UI.
export async function getStandardSuggestions(input: string): Promise<StandardMatch[]> {
  return matchStandards(input);
}
