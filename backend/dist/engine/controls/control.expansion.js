"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandControlsFromHazards = expandControlsFromHazards;
const HazardControlMap = {
    fall_hazard: ["fall_protection", "harness", "tie_off", "anchor_point"],
    electrical_hazard: ["lockout_tagout", "insulated_tools", "ground_fault_protection"],
    fire_hazard: ["fire_extinguisher", "fire_watch", "proper_storage"],
    struck_by: ["high_visibility", "equipment_separation", "warning_systems"],
    caught_between: ["machine_guarding", "lockout_tagout", "safe_clearance"],
    confined_space: ["permit_system", "atmospheric_testing", "attendant"],
    silica_exposure: ["respiratory_protection", "dust_control"],
    ventilation_issue: ["ventilation_system", "air_monitoring"],
    chemical_exposure: ["chemical_ppe", "spill_control", "labeling"],
    noise_exposure: ["hearing_protection"],
    slip_trip: ["housekeeping", "walking_surfaces"]
};
function expandControlsFromHazards(hazards) {
    return hazards.flatMap(h => HazardControlMap[h] || []);
}
//# sourceMappingURL=control.expansion.js.map