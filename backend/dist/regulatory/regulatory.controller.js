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
exports.RegulatoryController = void 0;
const common_1 = require("@nestjs/common");
const regulatory_sync_service_1 = require("./regulatory-sync.service");
const regulatory_service_1 = require("./regulatory.service");
const config_1 = require("@nestjs/config");
let RegulatoryController = class RegulatoryController {
    constructor(syncService, regulatoryService, config) {
        this.syncService = syncService;
        this.regulatoryService = regulatoryService;
        this.config = config;
    }
    async parts(agency = 'MSHA') {
        return this.regulatoryService.getParts(agency);
    }
    async sections(agency = 'MSHA', part = '56', q) {
        return this.regulatoryService.searchSections(agency, part, q);
    }
    async section(citation) {
        return this.regulatoryService.getSection(citation);
    }
    async sync(key, part, headerKey) {
        const envKey = this.config.get('REGULATORY_SYNC_KEY');
        if (process.env.NODE_ENV === 'production' && (!envKey || (key !== envKey && headerKey !== envKey))) {
            throw new common_1.UnauthorizedException();
        }
        const syncMap = {
            '46': () => this.syncService.syncPart46(),
            '47': () => this.syncService.syncPart47(),
            '48': () => this.syncService.syncPart48(),
            '50': () => this.syncService.syncPart50(),
            '56': () => this.syncService.syncPart56(),
            '57': () => this.syncService.syncPart57(),
            '62': () => this.syncService.syncPart62(),
            '77': () => this.syncService.syncPart77(),
            '1904': () => this.syncService.syncOsha1904(),
            '1910': () => this.syncService.syncOsha1910(),
            '1926': () => this.syncService.syncOsha1926(),
        };
        if (!part || !syncMap[part])
            throw new common_1.BadRequestException('Unsupported regulatory sync target.');
        return await syncMap[part]();
    }
};
exports.RegulatoryController = RegulatoryController;
__decorate([
    (0, common_1.Get)('parts'),
    __param(0, (0, common_1.Query)('agency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegulatoryController.prototype, "parts", null);
__decorate([
    (0, common_1.Get)('sections'),
    __param(0, (0, common_1.Query)('agency')),
    __param(1, (0, common_1.Query)('part')),
    __param(2, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], RegulatoryController.prototype, "sections", null);
__decorate([
    (0, common_1.Get)('section'),
    __param(0, (0, common_1.Query)('citation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegulatoryController.prototype, "section", null);
__decorate([
    (0, common_1.Post)('sync'),
    __param(0, (0, common_1.Query)('key')),
    __param(1, (0, common_1.Query)('part')),
    __param(2, (0, common_1.Headers)('x-sync-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RegulatoryController.prototype, "sync", null);
exports.RegulatoryController = RegulatoryController = __decorate([
    (0, common_1.Controller)('regulatory'),
    __metadata("design:paramtypes", [regulatory_sync_service_1.RegulatorySyncService, regulatory_service_1.RegulatoryService, config_1.ConfigService])
], RegulatoryController);
//# sourceMappingURL=regulatory.controller.js.map