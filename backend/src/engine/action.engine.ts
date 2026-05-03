import { classifyHazard } from './hazard.classifier';
import { HazardRules } from './hazard.rules';

export const generateActions = (text: string) => {
  const hazardType = classifyHazard(text);

  if (!hazardType) {
    return {
      immediateAction: "No immediate shutdown condition identified.",
      prioritizedActions: "No prioritized actions generated.",
      correctiveAction:
        "Evaluate condition and implement appropriate controls.",
      standards: [],
    };
  }

  const rule = HazardRules[hazardType];

  return {
    immediateAction: rule.immediateAction,
    prioritizedActions:  rule.prioritizedActions.map((a, i) => `${i + 1}. ${a}`).join('\n'),
    correctiveAction: rule.correctiveAction,
    standards: rule.standards,
  };
};
