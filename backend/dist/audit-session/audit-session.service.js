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
exports.AuditSessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_session_entity_1 = require("./audit-session.entity");
const audit_entry_entity_1 = require("./audit-entry.entity");
let AuditSessionService = class AuditSessionService {
    constructor(auditSessionRepo, auditEntryRepo) {
        this.auditSessionRepo = auditSessionRepo;
        this.auditEntryRepo = auditEntryRepo;
    }
    async createSession(dto) {
        const session = this.auditSessionRepo.create({
            status: 'draft',
            standardsMode: dto.standardsMode || 'msha_hybrid',
            ...dto,
        });
        return this.auditSessionRepo.save(session);
    }
    async addEntry(sessionId, dto) {
        const session = await this.auditSessionRepo.findOne({ where: { id: sessionId } });
        if (!session) {
            throw new common_1.NotFoundException('Audit session not found');
        }
        const entry = this.auditEntryRepo.create({
            auditSessionId: sessionId,
            ...dto,
        });
        return this.auditEntryRepo.save(entry);
    }
    async publish(sessionId) {
        const session = await this.auditSessionRepo.findOne({ where: { id: sessionId } });
        if (!session) {
            throw new common_1.NotFoundException('Audit session not found');
        }
        session.status = 'published';
        session.publishedAt = new Date();
        return this.auditSessionRepo.save(session);
    }
    async findAll() {
        return this.auditSessionRepo.find();
    }
    async findOne(id) {
        const session = await this.auditSessionRepo.findOne({
            where: { id },
            relations: ['entries'],
        });
        if (!session) {
            throw new common_1.NotFoundException('Audit session not found');
        }
        return session;
    }
};
exports.AuditSessionService = AuditSessionService;
exports.AuditSessionService = AuditSessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_session_entity_1.AuditSession)),
    __param(1, (0, typeorm_1.InjectRepository)(audit_entry_entity_1.AuditEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AuditSessionService);
//# sourceMappingURL=audit-session.service.js.map