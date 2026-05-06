"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAnalysisService = void 0;
const common_1 = require("@nestjs/common");
let AuditAnalysisService = class AuditAnalysisService {
    async analyzeEntry(input) {
        const narrative = [input.locationText, input.notes].filter(Boolean).join(' ').toLowerCase();
        const hazardCategoryCode = narrative.includes('ladder') || narrative.includes('trip') || narrative.includes('fall')
            ? 'fall_hazard'
            : narrative.includes('electrical') || narrative.includes('wire')
                ? 'electrical'
                : 'general_hazard';
        return {
            title: `Finding: ${hazardCategoryCode.replace(/_/g, ' ')}`,
            observedCondition: input.notes || 'Condition observed during walkthrough.',
            hazardCategoryCode,
            applicableStandards: [],
            severityLevel: hazardCategoryCode === 'electrical' ? 4 : 3,
            suggestedFix: hazardCategoryCode === 'electrical'
                ? 'Remove the electrical hazard from service and inspect the surrounding area.'
                : 'Correct the observed condition and secure the area against recurrence.',
            confidenceScore: 0.75,
            aiReasoning: {
                summary: `Draft finding generated for ${hazardCategoryCode}.`,
                methodology: 'RuleBasedAuditAnalysis',
                confidence: 0.75,
            },
            verificationStatus: 'draft',
        };
    }
};
exports.AuditAnalysisService = AuditAnalysisService;
exports.AuditAnalysisService = AuditAnalysisService = __decorate([
    (0, common_1.Injectable)()
], AuditAnalysisService);
//# sourceMappingURL=audit-analysis.service.js.map