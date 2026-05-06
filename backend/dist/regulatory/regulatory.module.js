"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulatoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const regulatory_agency_entity_1 = require("./entities/regulatory-agency.entity");
const regulatory_part_entity_1 = require("./entities/regulatory-part.entity");
const regulatory_subpart_entity_1 = require("./entities/regulatory-subpart.entity");
const regulatory_section_entity_1 = require("./entities/regulatory-section.entity");
const regulatory_paragraph_entity_1 = require("./entities/regulatory-paragraph.entity");
const regulatory_controller_1 = require("./regulatory.controller");
const regulatory_service_1 = require("./regulatory.service");
const regulatory_sync_service_1 = require("./regulatory-sync.service");
let RegulatoryModule = class RegulatoryModule {
};
exports.RegulatoryModule = RegulatoryModule;
exports.RegulatoryModule = RegulatoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                regulatory_agency_entity_1.RegulatoryAgency,
                regulatory_part_entity_1.RegulatoryPart,
                regulatory_subpart_entity_1.RegulatorySubpart,
                regulatory_section_entity_1.RegulatorySection,
                regulatory_paragraph_entity_1.RegulatoryParagraph,
            ]),
        ],
        controllers: [regulatory_controller_1.RegulatoryController],
        providers: [regulatory_service_1.RegulatoryService, regulatory_sync_service_1.RegulatorySyncService],
        exports: [regulatory_service_1.RegulatoryService],
    })
], RegulatoryModule);
//# sourceMappingURL=regulatory.module.js.map