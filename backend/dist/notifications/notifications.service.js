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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt = require("jsonwebtoken");
const notification_entity_1 = require("./notification.entity");
let NotificationsService = class NotificationsService {
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
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
    async create(data) {
        return this.notificationRepo.save(this.notificationRepo.create(data));
    }
    async findExistingForEntity(data) {
        return this.notificationRepo.findOne({
            where: {
                tenantId: data.tenantId,
                userId: data.userId,
                type: data.type,
                entityType: data.entityType,
                entityId: data.entityId,
            },
        });
    }
    async findMine(authHeader) {
        const auth = this.getAuthContext(authHeader);
        return this.notificationRepo.find({
            where: {
                tenantId: auth.tenantId,
                userId: auth.sub,
            },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async markRead(authHeader, id) {
        const auth = this.getAuthContext(authHeader);
        const notification = await this.notificationRepo.findOne({
            where: {
                id,
                tenantId: auth.tenantId,
                userId: auth.sub,
            },
        });
        if (!notification)
            throw new common_1.UnauthorizedException('Notification not found.');
        notification.read = true;
        return this.notificationRepo.save(notification);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map