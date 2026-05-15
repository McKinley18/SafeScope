export class StandardsReasoningService {
  evaluate(input: {
    classification: string;
    standards?: any[];
    operationalReasoning?: any;
    expandedContext?: any;
    risk?: any;
  }) {
    const ranked = (input.standards || []).map((standard: any) => {
      let defensibilityScore = 0.5;

      if (standard.source?.includes?.('curated')) defensibilityScore += 0.15;
      if (standard.source?.includes?.('cfr_database')) defensibilityScore += 0.15;

      if (input.operationalReasoning?.exposurePathways?.length) {
        defensibilityScore += 0.08;
      }

      if (input.risk?.requiresShutdown) {
        defensibilityScore += 0.05;
      }

      if (input.expandedContext?.environment) {
        defensibilityScore += 0.04;
      }

      defensibilityScore = Math.min(0.99, Number(defensibilityScore.toFixed(2)));

      return {
        ...standard,
        defensibilityScore,
        applicabilityConfidence:
          defensibilityScore >= 0.85
            ? "high"
            : defensibilityScore >= 0.7
              ? "medium"
              : "low",
        reasoning:
          `Standard matched using hazard classification, operational context, exposure pathways, and contextual risk indicators.`,
      };
    });

    const topDefensible = [...ranked]
      .sort((a, b) => b.defensibilityScore - a.defensibilityScore)
      .slice(0, 5);

    return {
      topDefensible,
      summary:
        topDefensible.length
          ? "Standards ranked using operational defensibility analysis."
          : "No defensible standards identified.",
    };
  }
}
