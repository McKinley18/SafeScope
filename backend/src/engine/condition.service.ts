import * as fs from 'fs';
import * as path from 'path';

const engine = require('./condition-engine');
const actionEngine = require('./action-engine');
const riskEngine = require('./risk-matrix-engine');

export class ConditionService {
  private library: any;

  constructor() {
    const p = path.join(
      process.cwd(),
      'test-data/condition-library/hazard-condition-library.json',
    );
    this.library = JSON.parse(fs.readFileSync(p, 'utf-8'));
  }

  classify(observation: string) {
    const classification = engine.classifyObservation(observation, {
      library: this.library,
    });

    const corrective = actionEngine.generateCorrectiveAction(classification);

    const riskAssessment = riskEngine.applyRiskAssessment(
      {
        suggestedSeverity: corrective.suggestedSeverity,
        suggestedLikelihood: corrective.suggestedLikelihood,
        suggestedExposure: corrective.suggestedExposure,
      },
      {},
    );

    return {
      ...classification,
      regulatoryIntent: corrective.regulatoryIntent,
      correctiveActions: corrective.correctiveActions,
      verificationSteps: corrective.verificationSteps,
      rootCausePrompts: corrective.rootCausePrompts,
      suggestedSeverity: corrective.suggestedSeverity,
      suggestedLikelihood: corrective.suggestedLikelihood,
      suggestedExposure: corrective.suggestedExposure,
      suggestedPriority: corrective.suggestedPriority,
      prioritySource: corrective.prioritySource,
      defaultDaysToComplete: corrective.defaultDaysToComplete,
      requiresRiskAssessment: corrective.requiresRiskAssessment,
      riskAssessment,
    };
  }
}
