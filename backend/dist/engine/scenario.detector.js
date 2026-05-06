"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectScenario = void 0;
const conditionKeywords = {
    missing: ["missing", "not present", "absent"],
    damaged: ["damaged", "broken", "defective"],
    blocked: ["blocked", "obstructed"],
};
const contextKeywords = {
    lift: ["lift", "scissor lift", "manlift", "aerial"],
    fireProtection: ["fire extinguisher", "extinguisher"],
};
const detectScenario = (text) => {
    const t = text.toLowerCase();
    const conditions = Object.entries(conditionKeywords)
        .filter(([_, words]) => words.some(w => t.includes(w)))
        .map(([key]) => key);
    const contexts = Object.entries(contextKeywords)
        .filter(([_, words]) => words.some(w => t.includes(w)))
        .map(([key]) => key);
    return { conditions, contexts };
};
exports.detectScenario = detectScenario;
//# sourceMappingURL=scenario.detector.js.map