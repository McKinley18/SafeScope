"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceControls = exports.hazardControlMap = void 0;
exports.hazardControlMap = {
    fall_hazard_from_lift: ["fall_protection", "harness", "tie_off", "anchor_point"],
    fall_hazard_general: ["fall_protection"],
    missing_fire_extinguisher_on_lift: ["fire_extinguisher"],
    electrical_exposure: ["lockout_tagout", "ppe"],
    struck_by_mobile_equipment: ["high_visibility", "traffic_control"],
    unclassified: []
};
const enforceControls = (hazards) => {
    const controls = hazards.flatMap(h => exports.hazardControlMap[h] || []);
    return Array.from(new Set(controls));
};
exports.enforceControls = enforceControls;
//# sourceMappingURL=control.enforcement.js.map