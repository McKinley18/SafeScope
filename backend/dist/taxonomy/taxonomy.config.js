"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLASSIFICATION_RULES = exports.HAZARD_CATEGORIES = exports.SEVERITY_LEVELS = void 0;
exports.SEVERITY_LEVELS = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    VERY_HIGH: 4,
    CRITICAL: 5,
};
exports.HAZARD_CATEGORIES = [
    { code: 'fall_hazard', label: 'Fall Hazard' },
    { code: 'electrical', label: 'Electrical' },
    { code: 'chemical', label: 'Chemical' },
    { code: 'mechanical', label: 'Mechanical' },
];
exports.CLASSIFICATION_RULES = [
    { code: 'fall_hazard', keywords: ['trip', 'fall', 'slip', 'ladder', 'height'], severity: 3 },
    { code: 'electrical', keywords: ['wire', 'spark', 'shock', 'electric', 'short'], severity: 4 },
    { code: 'chemical', keywords: ['spill', 'acid', 'chemical', 'toxic', 'fume'], severity: 4 },
    { code: 'mechanical', keywords: ['crush', 'gear', 'conveyor', 'machine', 'jam'], severity: 3 },
];
//# sourceMappingURL=taxonomy.config.js.map