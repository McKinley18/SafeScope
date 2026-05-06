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
exports.CorrectiveActionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt = require("jsonwebtoken");
const corrective_action_entity_1 = require("./entities/corrective-action.entity");
const audit_service_1 = require("../audit/audit.service");
const notifications_service_1 = require("../notifications/notifications.service");
let CorrectiveActionsService = class CorrectiveActionsService {
    constructor(actionRepo, auditService, notificationsService) {
        this.actionRepo = actionRepo;
        this.auditService = auditService;
        this.notificationsService = notificationsService;
    }
    getAuthContext(authHeader) {
        const token = authHeader?.replace('Bearer ', '');
        if (!token)
            throw new common_1.UnauthorizedException('Missing authorization token');
        const secret = process.env.JWT_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
            throw new common_1.UnauthorizedException('JWT secret is not configured.');
        }
        const signingSecret = secret || 'local_dev_secret_only';
        try {
            return jwt.verify(token, signingSecret);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid authorization token');
        }
    }
    buildFilter(statusCode, priorityCode, tenantId, assignedToUserId) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (assignedToUserId)
            where.assignedToUserId = assignedToUserId;
        if (statusCode)
            where.statusCode = statusCode;
        if (priorityCode)
            where.priorityCode = priorityCode;
        return where;
    }
    async findAll(authHeader, options) {
        const auth = this.getAuthContext(authHeader);
        const { page, limit, statusCode, priorityCode, assignedToMe } = options;
        const where = this.buildFilter(statusCode, priorityCode, auth.tenantId, assignedToMe ? auth.sub : undefined);
        const [data, total] = await this.actionRepo.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data,
            meta: { total, page, limit }
        };
    }
    async export(statusCode, priorityCode) {
        const where = this.buildFilter(statusCode, priorityCode);
        return this.actionRepo.find({ where, order: { createdAt: 'DESC' } });
    }
    async create(authHeader, dto) {
        const auth = this.getAuthContext(authHeader);
        const count = await this.actionRepo.count();
        const displayId = `ACT-${String(count + 2001).padStart(4, '0')}`;
        const action = this.actionRepo.create({
            ...dto,
            tenantId: auth.tenantId,
            ownerUserId: auth.sub,
            displayId,
        });
        const saved = await this.actionRepo.save(action);
        await this.auditService.log({
            tenantId: auth.tenantId,
            actorUserId: auth.sub,
            entityType: 'CORRECTIVE_ACTION',
            entityId: saved.id,
            actionCode: 'ACTION_CREATED',
            afterJson: saved,
        });
        if (saved.assignedToUserId) {
            await this.notificationsService.create({
                tenantId: auth.tenantId,
                userId: saved.assignedToUserId,
                type: 'assigned_action',
                title: 'New corrective action assigned',
                message: saved.title || 'A corrective action has been assigned to you.',
                entityType: 'CORRECTIVE_ACTION',
                entityId: saved.id,
            });
        }
        return saved;
    }
    async updateStatus(authHeader, id, body) {
        const auth = this.getAuthContext(authHeader);
        const action = await this.actionRepo.findOne({ where: { id, tenantId: auth.tenantId } });
        if (!action)
            throw new Error('Action not found');
        const before = { ...action };
        action.statusCode = body.statusCode;
        if (body.statusCode === 'closed') {
            action.closureNotes = body.closureNotes || action.closureNotes;
            action.verifiedAt = new Date();
            action.verifiedByUserId = auth.sub;
        }
        const updated = await this.actionRepo.save(action);
        await this.auditService.log({
            tenantId: auth.tenantId,
            actorUserId: auth.sub,
            entityType: 'CORRECTIVE_ACTION',
            entityId: updated.id,
            actionCode: 'ACTION_STATUS_UPDATED',
            beforeJson: before,
            afterJson: updated,
        });
        if (updated.assignedToUserId && before.statusCode !== updated.statusCode) {
            await this.notificationsService.create({
                tenantId: auth.tenantId,
                userId: updated.assignedToUserId,
                type: 'system',
                title: 'Corrective action status updated',
                message: `${updated.title || 'Corrective action'} is now ${updated.statusCode}.`,
                entityType: 'CORRECTIVE_ACTION',
                entityId: updated.id,
            });
        }
        return updated;
    }
    async generateDueDateAlerts(authHeader) {
        const auth = this.getAuthContext(authHeader);
        const now = Date.now();
        const oneDay = 1000 * 60 * 60 * 24;
        const actions = await this.actionRepo.find({
            where: { tenantId: auth.tenantId },
            order: { dueDate: 'ASC' },
        });
        let created = 0;
        for (const action of actions) {
            if (!action.assignedToUserId || !action.dueDate)
                continue;
            if (action.statusCode === 'closed' || action.statusCode === 'cancelled')
                continue;
            const due = new Date(action.dueDate).getTime();
            const isOverdue = due < now;
            const isDueSoon = due >= now && due <= now + oneDay;
            const type = isOverdue ? 'overdue_action' : isDueSoon ? 'due_soon_action' : null;
            if (!type)
                continue;
            const existing = await this.notificationsService.findExistingForEntity({
                tenantId: auth.tenantId,
                userId: action.assignedToUserId,
                type: type,
                entityType: 'CORRECTIVE_ACTION',
                entityId: action.id,
            });
            if (existing)
                continue;
            await this.notificationsService.create({
                tenantId: auth.tenantId,
                userId: action.assignedToUserId,
                type: type,
                title: isOverdue ? 'Corrective action overdue' : 'Corrective action due soon',
                message: `${action.title || 'Corrective action'} is ${isOverdue ? 'overdue' : 'due within 24 hours'}.`,
                entityType: 'CORRECTIVE_ACTION',
                entityId: action.id,
            });
            created += 1;
        }
        return { ok: true, created };
    }
    async close(id, dto) {
        const action = await this.actionRepo.findOne({ where: { id } });
        if (!action)
            throw new Error('Action not found');
        const before = { ...action };
        action.statusCode = 'closed';
        action.closureNotes = dto.closureNotes;
        action.verifiedAt = new Date();
        const updated = await this.actionRepo.save(action);
        await this.auditService.log({
            entityType: 'CORRECTIVE_ACTION',
            entityId: updated.id,
            actionCode: 'ACTION_CLOSED',
            beforeJson: before,
            afterJson: updated,
        });
        return updated;
    }
};
exports.CorrectiveActionsService = CorrectiveActionsService;
exports.CorrectiveActionsService = CorrectiveActionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(corrective_action_entity_1.CorrectiveAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService,
        notifications_service_1.NotificationsService])
], CorrectiveActionsService);
//# sourceMappingURL=corrective-actions.service.js.map