"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskService = void 0;
const common_1 = require("@nestjs/common");
let RiskService = class RiskService {
    suggest(category, description) {
        const descLower = (description || '').toLowerCase();
        let severity = 2;
        if (['Machine Guarding', 'Lockout / Energy', 'Fall Protection', 'Mobile Equipment'].includes(category || ''))
            severity = 4;
        else if (['Electrical', 'Berms / Roads / Dump Points', 'Fire / Hot Work'].includes(category || ''))
            severity = 3;
        let likelihood = 3;
        if (descLower.includes('missing') || descLower.includes('damaged'))
            likelihood = 4;
        const criticalKeywords = ['fatality', 'amputation', 'fall', 'energized', 'unguarded', 'fire', 'explosion', 'rollover'];
        if (criticalKeywords.some(w => descLower.includes(w))) {
            severity = 5;
            likelihood = 4;
        }
        if (descLower.includes('minor') || descLower.includes('cosmetic')) {
            severity = 1;
            likelihood = 2;
        }
        const score = severity * likelihood;
        const level = score >= 20 ? 'Critical' : score >= 15 ? 'High' : score >= 8 ? 'Moderate' : 'Low';
        const priority = score >= 20 ? 'Immediate Action' : score >= 15 ? 'High Priority' : score >= 8 ? 'Correct Soon' : 'Monitor';
        return {
            severitySuggestion: ['Low', 'Moderate', 'Serious', 'High', 'Critical'][severity - 1],
            likelihoodSuggestion: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'][likelihood - 1],
            riskScore: score,
            riskLevel: level,
            priorityLabel: priority,
            riskReasoning: `Risk scored based on ${category} category and keywords.`
        };
    }
};
exports.RiskService = RiskService;
exports.RiskService = RiskService = __decorate([
    (0, common_1.Injectable)()
], RiskService);
//# sourceMappingURL=risk.service.js.map