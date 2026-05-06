"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActions = void 0;
const hazard_classifier_1 = require("./hazard.classifier");
const hazard_rules_1 = require("./hazard.rules");
const generateActions = (text, riskBand) => {
    const classification = (0, hazard_classifier_1.classifyHazard)(text);
    console.log("CLASSIFICATION:", classification);
    const hazardTypes = classification.hazardTypes || [];
    let combinedImmediate = "";
    let combinedActions = [];
    let combinedCorrective = "";
    let combinedStandards = [];
    hazardTypes.forEach((type) => {
        const rule = hazard_rules_1.HazardRules[type];
        if (rule) {
            combinedImmediate = combinedImmediate || rule.immediateAction;
            combinedActions.push(...(rule.prioritizedActions || []));
            combinedStandards.push(...(rule.standards || []));
            combinedCorrective += " " + rule.correctiveAction;
        }
    });
    if (combinedActions.length === 0) {
        if (riskBand === "CRITICAL") {
            combinedImmediate = "IMMEDIATE ACTION REQUIRED: Stop work and correct hazard.";
            combinedActions = [
                "Inspect hazard immediately",
                "Apply corrective action",
                "Verify compliance",
                "Document correction"
            ];
        }
        else {
            combinedImmediate = "Corrective action required.";
            combinedActions = [
                "Inspect hazard",
                "Apply corrective action",
                "Verify condition"
            ];
        }
    }
    return {
        immediateAction: combinedImmediate,
        prioritizedActions: combinedActions.map((a, i) => `${i + 1}. ${a}`).join("\n"),
        correctiveAction: combinedCorrective.trim(),
        standards: Array.from(new Set(combinedStandards))
    };
};
exports.generateActions = generateActions;
//# sourceMappingURL=action.engine.js.map