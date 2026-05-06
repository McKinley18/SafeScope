"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankHazards = exports.classifyHazard = void 0;
const hazardKeywords = {
    fall_hazard: ["fall", "edge", "unguarded", "elevation", "open side"],
    fire_hazard: ["flammable", "combustible", "fire", "ignition"],
    electrical_hazard: ["live wire", "exposed wire", "energized", "electrical"],
    struck_by: ["truck", "loader", "equipment", "vehicle", "struck"],
    caught_between: ["pinch point", "caught between", "crush"],
    confined_space: ["confined space", "tank", "vessel", "limited entry"],
    silica_exposure: ["silica", "dust", "respirable"],
    ventilation_issue: ["ventilation", "fumes", "air quality"],
    chemical_exposure: ["chemical", "acid", "hazardous substance"],
    noise_exposure: ["noise", "loud", "hearing"],
    slip_trip: ["slip", "trip", "clutter", "debris"]
};
const contains = (text, keyword) => text.includes(keyword) ||
    keyword.split(" ").every(word => text.includes(word));
const classifyHazard = (text) => {
    const t = text.toLowerCase();
    const matches = [];
    for (const [hazard, keywords] of Object.entries(hazardKeywords)) {
        if (keywords.some(k => contains(t, k))) {
            matches.push(hazard);
        }
    }
    const unique = Array.from(new Set(matches));
    return {
        hazardTypes: unique.length ? unique : ["unclassified"],
        confidence: unique.length ? 0.9 : 0.5,
        signals: matches
    };
};
exports.classifyHazard = classifyHazard;
const hazardWeights = {
    fall_hazard: 1.0,
    confined_space: 1.0,
    electrical_hazard: 0.95,
    caught_between: 0.95,
    struck_by: 0.9,
    silica_exposure: 0.9,
    fire_hazard: 0.85,
    chemical_exposure: 0.85,
    ventilation_issue: 0.7,
    slip_trip: 0.6,
    noise_exposure: 0.5
};
const rankHazards = (hazardTypes) => {
    return hazardTypes
        .map(h => ({
        type: h,
        weight: hazardWeights[h] || 0.5
    }))
        .sort((a, b) => b.weight - a.weight);
};
exports.rankHazards = rankHazards;
//# sourceMappingURL=hazard.classifier.js.map