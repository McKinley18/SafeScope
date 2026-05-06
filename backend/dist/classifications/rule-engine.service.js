"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleEngine = void 0;
const common_1 = require("@nestjs/common");
const taxonomy_config_1 = require("../taxonomy/taxonomy.config");
let RuleEngine = class RuleEngine {
    constructor() {
        this.rules = taxonomy_config_1.CLASSIFICATION_RULES;
    }
    classify(narrative) {
        const text = narrative.toLowerCase();
        let bestMatch = null;
        let maxMatches = 0;
        const matchedKeywords = [];
        for (const rule of this.rules) {
            const matches = rule.keywords.filter(k => text.includes(k));
            if (matches.length > maxMatches) {
                maxMatches = matches.length;
                bestMatch = rule;
                matchedKeywords.push(...matches);
            }
        }
        const confidence = maxMatches > 0 ? Math.min(0.5 + (maxMatches * 0.1), 0.95) : 0.2;
        return {
            hazardCategoryCode: bestMatch ? bestMatch.code : 'unknown',
            severityLevel: bestMatch ? bestMatch.severity : 1,
            confidenceScore: confidence,
            requiresHumanReview: confidence < 0.7,
            reasoningSummary: {
                summary: bestMatch ? `Hazard detected: ${bestMatch.code}` : 'No clear hazard identified.',
                methodology: 'KeywordPatternMatching',
                confidence,
                matchedKeywords: [...new Set(matchedKeywords)],
                matchedRules: bestMatch ? [bestMatch.code] : [],
                extractedEntities: [],
            }
        };
    }
};
exports.RuleEngine = RuleEngine;
exports.RuleEngine = RuleEngine = __decorate([
    (0, common_1.Injectable)()
], RuleEngine);
//# sourceMappingURL=rule-engine.service.js.map