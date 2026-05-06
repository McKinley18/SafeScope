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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const audit_service_1 = require("./audit.service");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
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
    findWorkspaceAudit(authorization) {
        const auth = this.getAuthContext(authorization);
        if (!['owner', 'admin'].includes(auth.role)) {
            throw new common_1.UnauthorizedException('Only owners and admins can view audit logs.');
        }
        return this.auditService.getAuditByTenant(auth.tenantId);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findWorkspaceAudit", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.Controller)('audit'),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map