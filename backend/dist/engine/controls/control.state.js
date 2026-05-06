"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildControlStates = buildControlStates;
const normalize = (v) => String(v || "").toLowerCase().trim().replace(/\s+/g, "_");
function buildControlStates(hazardTypes, controlFindings, requiredControls) {
    const states = [];
    const detected = (controlFindings || []).map(c => normalize(c.control));
    for (const ctrl of requiredControls) {
        states.push({
            control: normalize(ctrl),
            state: "missing",
            source: "hazard",
            confidence: 1,
        });
    }
    for (const c of controlFindings || []) {
        const val = normalize(c.control);
        const isMissing = val.includes("missing");
        const cleaned = val.replace("missing_", "");
        const index = states.findIndex(s => s.control === cleaned);
        if (index !== -1) {
            states[index] = {
                control: cleaned,
                state: isMissing ? "missing" : "present",
                source: "text",
                confidence: 0.7,
            };
        }
        else {
            states.push({
                control: cleaned,
                state: isMissing ? "missing" : "present",
                source: "text",
                confidence: 0.7,
            });
        }
    }
    return states;
}
//# sourceMappingURL=control.state.js.map