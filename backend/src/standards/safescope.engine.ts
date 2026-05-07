import { Standard } from './standard.entity';
import { Feedback } from './feedback.entity';

function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

// 🔥 decay function (recent = strong, old = weak)
function getDecayWeight(date: Date): number {
  const now = new Date().getTime();
  const diffDays = (now - new Date(date).getTime()) / (1000 * 60 * 60 * 24);

  // exponential decay
  return Math.exp(-diffDays / 30); // 30-day half-life
}

function scoreMatch(
  hazardTokens: string[],
  contextTokens: string[],
  standard: Standard,
  feedback: Feedback[]
) {
  const text = `${standard.title} ${standard.text}`.toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  // base matching
  for (const token of hazardTokens) {
    if (text.includes(token)) {
      score += 3;
      reasons.push(token);
    }
  }

  for (const token of contextTokens) {
    if (text.includes(token)) {
      score += 2;
      reasons.push(token);
    }
  }

  // baseline boosts
  if (text.includes('fall')) score += 2;
  if (text.includes('guard')) score += 2;

  // 🔥 FEEDBACK WITH DECAY
  const related = feedback.filter(
    (f) => f.citation === standard.citation
  );

  for (const f of related) {
    const weight = getDecayWeight(f.createdAt);

    if (f.action === 'accept') score += 5 * weight;
    if (f.action === 'reject') score -= 5 * weight;

    if (
      f.action === 'change' &&
      f.replacementCitation === standard.citation
    ) {
      score += 6 * weight;
    }
  }

  return {
    score,
    reasons: Array.from(new Set(reasons)),
  };
}

export function analyzeHazardV3(
  hazard: string,
  context: string,
  standards: Standard[],
  feedback: Feedback[],
  limit = 5
) {
  const hazardTokens = tokenize(hazard);
  const contextTokens = tokenize(context);

  return standards
    .map((std) => {
      const { score, reasons } = scoreMatch(
        hazardTokens,
        contextTokens,
        std,
        feedback
      );

      return {
        citation: std.citation,
        title: std.title,
        score,
        confidence: Math.min(score / 10, 1),
        reasons,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
