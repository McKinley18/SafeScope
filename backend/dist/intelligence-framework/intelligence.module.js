"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligenceLibraryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hazard_taxonomy_entity_1 = require("./entities/hazard-taxonomy.entity");
const intelligence_service_1 = require("./intelligence.service");
let IntelligenceLibraryModule = class IntelligenceLibraryModule {
};
exports.IntelligenceLibraryModule = IntelligenceLibraryModule;
exports.IntelligenceLibraryModule = IntelligenceLibraryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hazard_taxonomy_entity_1.HazardTaxonomy])],
        providers: [intelligence_service_1.IntelligenceService],
        exports: [intelligence_service_1.IntelligenceService],
    })
], IntelligenceLibraryModule);
//# sourceMappingURL=intelligence.module.js.map