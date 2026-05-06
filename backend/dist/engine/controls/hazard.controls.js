"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardControlMap = void 0;
exports.HazardControlMap = {
    fall_hazard_from_lift: [
        "fall_protection",
        "tie_off",
        "anchor_point"
    ],
    fall_hazard_general: [
        "guardrails",
        "fall_protection"
    ],
    missing_fire_extinguisher: [
        "fire_extinguisher"
    ],
    fire_hazard: [
        "fire_extinguisher",
        "flammable_storage"
    ],
    electrical_exposure: [
        "lockout_tagout",
        "electrical_ppe",
        "isolation"
    ],
    struck_by_mobile_equipment: [
        "traffic_control",
        "high_visibility_ppe",
        "equipment_separation"
    ],
    caught_between_equipment: [
        "pinch_point_guarding",
        "safe_positioning"
    ],
    confined_space: [
        "permit",
        "air_monitoring",
        "attendant"
    ],
    silica_exposure: [
        "respirator",
        "dust_control"
    ],
    missing_ppe: [
        "ppe_required"
    ]
};
//# sourceMappingURL=hazard.controls.js.map