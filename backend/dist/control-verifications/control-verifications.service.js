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
exports.ControlVerificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const control_verification_entity_1 = require("./entities/control-verification.entity");
let ControlVerificationsService = class ControlVerificationsService {
    constructor(repo) {
        this.repo = repo;
    }
    async saveMany(reportId, controls) {
        const entities = (controls || []).map(c => this.repo.create({
            reportId,
            control: c.control,
            status: c.status,
            notes: c.notes,
        }));
        return this.repo.save(entities);
    }
    async create(reportId, dto) {
        console.log("CREATE INPUT:", reportId, dto);
        return this.repo.save({
            reportId,
            control: dto.control,
            status: dto.status,
            notes: dto.notes,
        });
    }
    async getForReport(reportId) {
        return this.repo.find({ where: { reportId } });
    }
};
exports.ControlVerificationsService = ControlVerificationsService;
exports.ControlVerificationsService = ControlVerificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(control_verification_entity_1.ControlVerification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ControlVerificationsService);
//# sourceMappingURL=control-verifications.service.js.map