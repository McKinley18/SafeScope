// Safe standards matcher (null-safe, production-ready)

type Standard = {
  id: string;
  source: string;
  citation?: string;
  description?: string;
};

type Result = {
  standards?: Standard[];
} | null;

export function matchStandards(results: Result[]) {
  const matches: {
    id: string;
    source: string;
    citation?: string;
    description?: string;
  }[] = [];

  // 🧠 Null-safe iteration
  for (const result of results || []) {
    if (!result || !result.standards || !Array.isArray(result.standards)) {
      continue;
    }

    for (const standard of result.standards) {
      if (!standard) continue;

      matches.push({
        id: standard.id,
        source: standard.source,
        citation: standard.citation,
        description: standard.description,
      });
    }
  }

  return matches;
}
