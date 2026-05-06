"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateHazardControls = void 0;
const hazard_controls_1 = require("./hazard.controls");
const evaluateHazardControls = (hazardTypes, existingControls) => {
    const existing = existingControls.map(c => (c.control || "").toLowerCase());
    const missingControls = [];
    for (const hazard of hazardTypes) {
        const required = hazard_controls_1.HazardControlMap[hazard] || [];
        for (const control of required) {
            if (!existing.includes(control)) {
                missingControls.push(control);
            }
        }
    }
    return Array.from(new Set(missingControls));
};
exports.evaluateHazardControls = evaluateHazardControls;
//# sourceMappingURL=control.relationships.js.map