import { HazardType } from './hazard.types';

export const HazardRules = {
  [HazardType.FALL]: {
    immediateAction:
      "IMMEDIATE ACTION REQUIRED: Remove personnel from exposure and secure the hazard area until corrective measures are completed.",

    prioritizedActions: [
      "Eliminate hazard at source (engineering control).",
      "Install temporary fall protection or barriers.",
      "Restrict access to affected area.",
      "Inspect surrounding structures for similar conditions.",
    ],

    correctiveAction:
      "Repair or replace damaged railing immediately. Install compliant guardrails meeting MSHA requirements. Restrict access to the affected area until repairs are completed. Conduct inspection of all elevated surfaces for similar hazards.",

    standards: ["MSHA 56.11001"],
  },

  [HazardType.ELECTRICAL]: {
    immediateAction:
      "IMMEDIATE ACTION REQUIRED: De-energize equipment and isolate energy sources before work begins.",

    prioritizedActions: [
      "Apply lockout/tagout procedures.",
      "Inspect wiring and insulation integrity.",
      "Ensure proper grounding.",
    ],

    correctiveAction:
      "Repair or replace damaged electrical components. Verify compliance with MSHA electrical safety standards.",

    standards: ["MSHA 56.12004"],
  },
};
