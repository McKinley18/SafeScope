"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchEngineService = void 0;
const common_1 = require("@nestjs/common");
const hazard_conditions_1 = require("./data/hazard-conditions");
let MatchEngineService = class MatchEngineService {
    match(desc, category, mode) {
        const descNormal = desc.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        let bestFamily = { id: 'other_uncertain', score: 0 };
        for (const [id, config] of Object.entries(hazard_conditions_1.HAZARD_FAMILIES)) {
            let score = 0;
            config.keywords.forEach(k => { if (descNormal.includes(k))
                score += 50; });
            if (score > bestFamily.score)
                bestFamily = { id, score };
        }
        if (bestFamily.score < 30)
            return { primaryConditionId: "other_uncertain", confidence: 0 };
        const familyConfig = hazard_conditions_1.HAZARD_FAMILIES[bestFamily.id];
        let bestSubtype = { id: familyConfig.conditions[0], score: 0 };
        familyConfig.conditions.forEach(cond => {
            let subScore = 0;
            if (descNormal.includes(cond.replace('_', ' ')))
                subScore += 100;
            if (subScore > bestSubtype.score)
                bestSubtype = { id: cond, score: subScore };
        });
        return {
            primaryConditionId: bestSubtype.id,
            parentConditionId: bestFamily.id,
            confidence: bestFamily.score + bestSubtype.score,
            needsReview: bestSubtype.score < 50
        };
    }
};
exports.MatchEngineService = MatchEngineService;
exports.MatchEngineService = MatchEngineService = __decorate([
    (0, common_1.Injectable)()
], MatchEngineService);
//# sourceMappingURL=match-engine.service.js.map