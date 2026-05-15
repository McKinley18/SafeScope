export type OperationalReasoningInput = {
  text: string;
  classification: string;
  expandedContext?: any;
  risk?: any;
};

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export class OperationalReasoningService {
  evaluate(input: OperationalReasoningInput) {
    const text = String(input.text || "").toLowerCase();
    const classification = input.classification || "Review Required";

    const exposurePathways: string[] = [];
    const likelyInjuryMechanisms: string[] = [];
    const operationalStateSignals: string[] = [];
    const humanInteractionSignals: string[] = [];
    const energyTransferSignals: string[] = [];
    const assumptions: string[] = [];
    const uncertainty: string[] = [];

    if (includesAny(text, ["employee", "worker", "operator", "mechanic", "pedestrian", "person"])) {
      humanInteractionSignals.push("Worker or pedestrian exposure is described.");
    } else {
      uncertainty.push("Worker exposure is not explicitly described.");
    }

    if (includesAny(text, ["near", "within reach", "access", "walkway", "platform", "working", "using", "operating"])) {
      exposurePathways.push("The hazard appears accessible during normal work or travel.");
    } else {
      assumptions.push("Exposure pathway may exist, but the description does not clearly define access or proximity.");
    }

    if (includesAny(text, ["running", "operating", "energized", "moving", "live"])) {
      operationalStateSignals.push("Equipment or energy source may be active.");
      energyTransferSignals.push("Active energy could transfer to a worker through contact, motion, electricity, pressure, or gravity.");
    }

    if (includesAny(text, ["locked out", "lockout", "de-energized", "shut down", "isolated"])) {
      operationalStateSignals.push("Energy-control status is referenced.");
    }

    if (classification === "Machine Guarding" || classification === "Machine") {
      likelyInjuryMechanisms.push("Caught-in, struck-by, pinch-point, or amputation exposure from moving machine parts.");
      if (!includesAny(text, ["guard", "guarding", "barrier", "cover"])) {
        uncertainty.push("Guarding status is not clearly documented.");
      }
    }

    if (classification === "Electrical") {
      likelyInjuryMechanisms.push("Shock, arc flash, burn, or electrocution exposure.");
      if (!includesAny(text, ["energized", "voltage", "panel", "breaker", "cord", "conductor", "live"])) {
        uncertainty.push("Electrical energy details are limited.");
      }
    }

    if (classification === "Fall" || classification === "Fall Protection") {
      likelyInjuryMechanisms.push("Fall to lower level or same-level fall resulting in serious injury.");
      if (!includesAny(text, ["height", "feet", "edge", "guardrail", "platform", "ladder"])) {
        uncertainty.push("Fall height or edge condition is not clearly defined.");
      }
    }

    if (classification === "Powered Mobile Equipment") {
      likelyInjuryMechanisms.push("Struck-by, caught-between, rollover, or pedestrian interaction exposure.");
      if (!includesAny(text, ["traffic", "backup", "blind spot", "pedestrian", "truck", "loader", "forklift"])) {
        uncertainty.push("Mobile equipment movement or pedestrian interface is not clearly defined.");
      }
    }

    if (classification === "Housekeeping") {
      likelyInjuryMechanisms.push("Slip, trip, fall, blocked access, or emergency egress restriction.");
    }

    if (classification === "Hazard Communication") {
      likelyInjuryMechanisms.push("Chemical exposure, inhalation, skin contact, or incompatible material handling.");
    }

    const causalChain = [
      exposurePathways[0] || "Exposure pathway requires confirmation.",
      energyTransferSignals[0] || "Energy transfer mechanism requires confirmation.",
      likelyInjuryMechanisms[0] || "Injury mechanism requires supervisor review.",
    ];

    return {
      exposurePathways,
      likelyInjuryMechanisms,
      operationalStateSignals,
      humanInteractionSignals,
      energyTransferSignals,
      causalChain,
      assumptions,
      uncertainty,
      reasoningSummary: causalChain.filter(Boolean).join(" → "),
      supervisorQuestions: [
        ...uncertainty.map((item) => `Confirm: ${item}`),
        ...assumptions.map((item) => `Verify: ${item}`),
      ].slice(0, 5),
    };
  }
}
