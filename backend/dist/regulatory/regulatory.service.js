"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulatoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const regulatory_section_entity_1 = require("./entities/regulatory-section.entity");
const regulatory_part_entity_1 = require("./entities/regulatory-part.entity");
let RegulatoryService = class RegulatoryService {
    constructor(sectionRepo, partRepo) {
        this.sectionRepo = sectionRepo;
        this.partRepo = partRepo;
    }
    async getParts(agency) {
        return await this.partRepo.find({ where: { agencyCode: agency } });
    }
    async searchSections(agency, part, query) {
        const where = { agencyCode: agency, part };
        if (query) {
            where.heading = (0, typeorm_2.ILike)(`%${query}%`);
        }
        return await this.sectionRepo.find({ where });
    }
    async getSection(citation) {
        return await this.sectionRepo.findOne({ where: { citation } });
    }
};
exports.RegulatoryService = RegulatoryService;
exports.RegulatoryService = RegulatoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(regulatory_section_entity_1.RegulatorySection)),
    __param(1, (0, typeorm_1.InjectRepository)(regulatory_part_entity_1.RegulatoryPart)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RegulatoryService);
//# sourceMappingURL=regulatory.service.js.map