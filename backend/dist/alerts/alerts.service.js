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
var AlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const corrective_action_entity_1 = require("../corrective-actions/entities/corrective-action.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let AlertsService = AlertsService_1 = class AlertsService {
    constructor(actionRepo, notificationsService) {
        this.actionRepo = actionRepo;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(AlertsService_1.name);
    }
    async scanDueDates() {
        const now = Date.now();
        const oneDay = 1000 * 60 * 60 * 24;
        const actions = await this.actionRepo.find({
            order: { dueDate: 'ASC' },
        });
        let created = 0;
        for (const action of actions) {
            if (!action.tenantId || !action.assignedToUserId || !action.dueDate)
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
                tenantId: action.tenantId,
                userId: action.assignedToUserId,
                type: type,
                entityType: 'CORRECTIVE_ACTION',
                entityId: action.id,
            });
            if (existing)
                continue;
            await this.notificationsService.create({
                tenantId: action.tenantId,
                userId: action.assignedToUserId,
                type: type,
                title: isOverdue ? 'Corrective action overdue' : 'Corrective action due soon',
                message: `${action.title || 'Corrective action'} is ${isOverdue ? 'overdue' : 'due within 24 hours'}.`,
                entityType: 'CORRECTIVE_ACTION',
                entityId: action.id,
            });
            created += 1;
        }
        if (created > 0) {
            this.logger.log(`Created ${created} due date alert(s).`);
        }
    }
};
exports.AlertsService = AlertsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertsService.prototype, "scanDueDates", null);
exports.AlertsService = AlertsService = AlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(corrective_action_entity_1.CorrectiveAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map