"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHazardRisk = exports.calculateRisk = void 0;
const severityMap = {
    high: 5,
    medium: 3,
    low: 1,
};
const probabilityFromText = (text) => {
    const t = text.toLowerCase();
    if (t.includes("exposed") || t.includes("unguarded") || t.includes("immediate"))
        return 5;
    if (t.includes("frequent") || t.includes("regular"))
        return 4;
    if (t.includes("possible"))
        return 3;
    if (t.includes("unlikely"))
        return 2;
    return 3;
};
const exposureFromText = (text) => {
    const t = text.toLowerCase();
    if (t.includes("continuous") || t.includes("always"))
        return 5;
    if (t.includes("daily"))
        return 4;
    if (t.includes("periodic"))
        return 3;
    if (t.includes("rare"))
        return 2;
    return 3;
};
const calculateRisk = (input) => {
    const severityScore = severityMap[(input.severity || "").toLowerCase()] || 3;
    const narrative = input.narrative || "";
    const industry = input.industry || "msha";
    let probabilityScore = input.probability ?? 3;
    let exposureScore = input.exposure ?? 3;
    if (industry === "msha") {
        exposureScore = Math.min(5, exposureScore + 0.5);
    }
    if (industry === "osha") {
        probabilityScore = Math.min(5, probabilityScore + 0.5);
    }
    let severityWeight = 0.5;
    let probabilityWeight = 0.3;
    let exposureWeight = 0.2;
    if (industry === "msha") {
        exposureWeight = 0.3;
        probabilityWeight = 0.25;
    }
    if (industry === "osha") {
        probabilityWeight = 0.35;
        exposureWeight = 0.15;
    }
    let riskScore = severityScore * severityWeight +
        probabilityScore * probabilityWeight +
        exposureScore * exposureWeight;
    if (input.controls && input.controls.length > 0) {
        const controlImpact = input.controls.reduce((sum, c) => sum + (c.weight || 0), 0);
        riskScore = Math.min(5, riskScore + controlImpact);
    }
    let riskBand = "LOW";
    if (riskScore >= 4.5)
        riskBand = "CRITICAL";
    else if (riskScore >= 3.5)
        riskBand = "HIGH";
    else if (riskScore >= 2.5)
        riskBand = "MODERATE";
    return {
        severityScore,
        probabilityScore: Math.round(probabilityScore),
        exposureScore: Math.round(exposureScore),
        riskScore: Number(riskScore.toFixed(2)),
        riskBand,
        industry,
    };
};
exports.calculateRisk = calculateRisk;
const hazardModifiers = {
    fall_hazard_from_lift: {
        probability: 5,
        exposure: 5
    },
    missing_fire_extinguisher_on_lift: {
        probability: 3,
        exposure: 3
    },
    working_from_lift: {
        probability: 2,
        exposure: 2
    }
};
const calculateHazardRisk = (base, hazardType) => {
    const modifier = hazardModifiers[hazardType] || {};
    return (0, exports.calculateRisk)({
        ...base,
        ...modifier
    });
};
exports.calculateHazardRisk = calculateHazardRisk;
//# sourceMappingURL=risk.engine.js.map