import { HAZARD_TAXONOMY, HazardProfile, HazardSignal } from "../taxonomy/hazard-taxonomy";

type ConfidenceBand = "low" | "medium" | "high";

type WeightedCandidate = {
  id: string;
  classification: string;
  family: string;
  score: number;
  maxPossibleSignalScore: number;
  evidenceTokens: string[];
  negativeTokens: string[];
  matchedControls: string[];
  commonConsequences: string[];
  explanation: string;
};

function normalize(value: string): string {
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s/.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function scoreSignals(normalizedText: string, signals: HazardSignal[]) {
  let score = 0;
  const matches: string[] = [];

  for (const signal of signals) {
    const term = normalize(signal.term);
    if (!term) continue;

    if (normalizedText.includes(term)) {
      score += signal.weight;
      matches.push(signal.term);
    }
  }

  return { score, matches };
}

function confidenceFromScore(score: number, margin: number): {
  confidence: number;
  confidenceBand: ConfidenceBand;
} {
  if (score >= 16 && margin >= 5) return { confidence: 0.93, confidenceBand: "high" };
  if (score >= 10 && margin >= 3) return { confidence: 0.82, confidenceBand: "high" };
  if (score >= 7) return { confidence: 0.7, confidenceBand: "medium" };
  if (score >= 4) return { confidence: 0.52, confidenceBand: "low" };
  return { confidence: 0.25, confidenceBand: "low" };
}

export class WeightedClassifierService {
  classify(text: string) {
    const normalizedText = normalize(text);

    const candidates: WeightedCandidate[] = HAZARD_TAXONOMY.map((profile: HazardProfile) => {
      const strong = scoreSignals(normalizedText, profile.strongSignals);
      const moderate = scoreSignals(normalizedText, profile.moderateSignals);
      const weak = scoreSignals(normalizedText, profile.weakSignals);
      const context = scoreSignals(normalizedText, profile.contextBoosts);
      const negative = scoreSignals(normalizedText, profile.negativeSignals);

      const score = strong.score + moderate.score + weak.score + context.score + negative.score;

      return {
        id: profile.id,
        classification: profile.label,
        family: profile.family,
        score,
        maxPossibleSignalScore:
          strong.score + moderate.score + weak.score + context.score,
        evidenceTokens: unique([
          ...strong.matches,
          ...moderate.matches,
          ...weak.matches,
          ...context.matches,
        ]),
        negativeTokens: unique(negative.matches),
        matchedControls: profile.requiredControls,
        commonConsequences: profile.commonConsequences,
        explanation:
          score > 0
            ? `SafeScope matched weighted ${profile.label} signals.`
            : `No meaningful ${profile.label} signal match.`,
      };
    }).sort((a, b) => b.score - a.score);

    const best = candidates[0];
    const second = candidates[1];
    const margin = best && second ? best.score - second.score : best?.score || 0;

    if (!best || best.score <= 0) {
      return {
        classification: "Review Required",
        confidence: 0,
        confidenceBand: "low",
        evidenceTokens: [],
        ambiguityWarnings: ["No strong SafeScope taxonomy match."],
        requiresHumanReview: true,
        explanation: "No weighted hazard profile exceeded the classification threshold.",
        additionalHazards: [],
        excludedHazards: candidates.slice(0, 5).map((candidate) => ({
          classification: candidate.classification,
          reason: "No positive weighted signal match.",
          negativeTokens: candidate.negativeTokens,
        })),
      };
    }

    const confidence = confidenceFromScore(best.score, margin);
    const ambiguityWarnings: string[] = [];

    if (second && second.score > 0 && margin <= 3) {
      ambiguityWarnings.push(
        `Close match between ${best.classification} and ${second.classification}.`
      );
    }

    if (best.negativeTokens.length > 0) {
      ambiguityWarnings.push(
        `${best.classification} had exclusion signals: ${best.negativeTokens.join(", ")}.`
      );
    }

    const additionalHazards = candidates
      .filter((candidate) => candidate.score > 0 && candidate.classification !== best.classification)
      .slice(0, 4)
      .map((candidate) => {
        const band = confidenceFromScore(candidate.score, candidate.score);
        return {
          classification: candidate.classification,
          confidence: band.confidence,
          confidenceBand: band.confidenceBand,
          evidenceTokens: candidate.evidenceTokens,
          negativeTokens: candidate.negativeTokens,
          requiresHumanReview: band.confidenceBand === "low",
          explanation: candidate.explanation,
        };
      });

    const excludedHazards = candidates
      .filter((candidate) => candidate.score <= 0 || candidate.negativeTokens.length > 0)
      .slice(0, 6)
      .map((candidate) => ({
        classification: candidate.classification,
        reason:
          candidate.negativeTokens.length > 0
            ? `Excluded or reduced by signals: ${candidate.negativeTokens.join(", ")}.`
            : "Insufficient weighted signal evidence.",
        negativeTokens: candidate.negativeTokens,
      }));

    return {
      classification: best.classification,
      confidence: confidence.confidence,
      confidenceBand: confidence.confidenceBand,
      evidenceTokens: best.evidenceTokens,
      ambiguityWarnings,
      requiresHumanReview:
        confidence.confidenceBand === "low" || ambiguityWarnings.length > 0,
      explanation: best.explanation,
      score: best.score,
      scoreMargin: margin,
      commonConsequences: best.commonConsequences,
      requiredControls: best.matchedControls,
      additionalHazards,
      excludedHazards,
    };
  }
}
