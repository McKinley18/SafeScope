import { Controller, Get, Param } from '@nestjs/common';
import { TransparencyService } from './transparency.service';

@Controller('reports')
export class TransparencyController {
  constructor(private readonly transparencyService: TransparencyService) {}

  @Get(':id/explain')
  async explain(@Param('id') id: string) {
    const breakdown = await this.transparencyService.getDecisionBreakdown(id);
    const justification = await this.transparencyService.getActionJustification(id);
    const outcome = await this.transparencyService.getOutcomeExplanation(id);

    const narrative = `This hazard was classified as ${breakdown.category} with ${breakdown.confidenceLevel} confidence due to direct matches with '${breakdown.signals.fuzzyMatches[0]}'. The recommended action is ${justification.priority} because it presents ${justification.whyThisAction} per ${justification.standardJustification}. The corrective action has been ${outcome.effectiveness}ly verified after ${outcome.factors.observationWindow} days with no recurrence in a high-exposure area.`;

    console.log("\n=== DECISION EXPLANATION ===\n");
    console.log(`Category: ${breakdown.category} (${breakdown.confidenceLevel} CONFIDENCE)`);
    console.log(`\nWhy:\n- Matched: ${breakdown.signals.fuzzyMatches.join(', ')}\n- Context: ${breakdown.signals.contextSignals.join(', ')}`);
    console.log(`\nAction:\n- ${justification.priority} due to ${justification.whyThisAction}`);
    console.log(`\nOutcome:\n- ${outcome.effectiveness} (Confidence: ${outcome.verificationConfidence})`);
    console.log(`\nNarrative:\n"${narrative}"`);

    return {
      breakdown,
      justification,
      outcome,
      narrative
    };
  }
}
