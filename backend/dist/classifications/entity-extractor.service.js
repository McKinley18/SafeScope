"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityExtractorService = void 0;
const common_1 = require("@nestjs/common");
let EntityExtractorService = class EntityExtractorService {
    constructor() {
        this.patterns = [
            { type: 'equipment', keywords: ['forklift', 'drill', 'conveyor', 'ladder', 'harness', 'welder'] },
            { type: 'location', keywords: ['floor', 'warehouse', 'loading dock', 'office', 'roof'] },
            { type: 'condition', keywords: ['wet', 'slick', 'dark', 'crowded', 'noisy'] },
        ];
    }
    extract(text) {
        const extracted = [];
        const lower = text.toLowerCase();
        for (const pattern of this.patterns) {
            for (const keyword of pattern.keywords) {
                if (lower.includes(keyword)) {
                    extracted.push({ type: pattern.type, value: keyword });
                }
            }
        }
        return extracted;
    }
};
exports.EntityExtractorService = EntityExtractorService;
exports.EntityExtractorService = EntityExtractorService = __decorate([
    (0, common_1.Injectable)()
], EntityExtractorService);
//# sourceMappingURL=entity-extractor.service.js.map