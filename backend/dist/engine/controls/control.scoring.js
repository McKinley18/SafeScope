"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateControlScore = void 0;
const calculateControlScore = (required, present) => {
    const presentSet = new Set(present.map(p => p.control));
    const missing = required.filter(r => !presentSet.has(r));
    const score = required.length === 0
        ? 100
        : Math.round(((required.length - missing.length) / required.length) * 100);
    return {
        score,
        requiredCount: required.length,
        missingCount: missing.length,
        missingControls: missing
    };
};
exports.calculateControlScore = calculateControlScore;
//# sourceMappingURL=control.scoring.js.map