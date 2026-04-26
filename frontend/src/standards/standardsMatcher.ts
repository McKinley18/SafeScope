import { analyzeHazardContext } from '../intelligence/hazardIntelligence';

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

export function matchStandards(input: string): StandardMatch[] {
  const results = analyzeHazardContext({
    hazardDescription: input,
  });

  const matches: StandardMatch[] = [];

  for (const result of results) {
    for (const standard of result.standards) {
      matches.push({
        id: standard.id,
        source: standard.source,
        citation: standard.citation,
        title: standard.title,
        category: standard.category,
        confidence: result.confidence,
        rationale: `Matched ${result.hazard.name}. Terms: ${result.matchedTerms.join(', ')}. ${standard.verificationNote}`,
        keywords: standard.keywords,
      });
    }
  }

  const seen = new Set<string>();
  return matches.filter((match) => {
    if (seen.has(match.id)) return false;
    seen.add(match.id);
    return true;
  });
}

export async function getStandardSuggestions(input: string): Promise<StandardMatch[]> {
  return matchStandards(input);
}
