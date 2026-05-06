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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const user_entity_1 = require("../users/entities/user.entity");
const workspace_invite_entity_1 = require("./entities/workspace-invite.entity");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(userRepo, inviteRepo, emailService) {
        this.userRepo = userRepo;
        this.inviteRepo = inviteRepo;
        this.emailService = emailService;
    }
    sign(user) {
        const secret = process.env.JWT_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
            throw new common_1.UnauthorizedException('JWT secret is not configured.');
        }
        const signingSecret = secret || 'local_dev_secret_only';
        return jwt.sign({
            sub: user.id,
            email: user.email,
            tenantId: user.tenantId,
            workspaceType: user.workspaceType,
            companyName: user.companyName,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }, signingSecret, { expiresIn: '7d' });
    }
    async register(dto) {
        const count = await this.userRepo.count();
        const workspaceType = dto.workspaceType || 'individual';
        const tenantId = dto.tenantId || 'default';
        if (workspaceType === 'individual') {
            const existingPersonalWorkspace = await this.userRepo.count({
                where: { tenantId },
            });
            if (existingPersonalWorkspace >= 1) {
                throw new common_1.UnauthorizedException('This personal workspace already has an account.');
            }
        }
        if (workspaceType === 'company') {
            const existingCompanyUsers = await this.userRepo.count({
                where: { tenantId },
            });
            const workspaceOwner = await this.userRepo.findOne({
                where: { tenantId, role: 'owner' },
            });
            const seatLimit = workspaceOwner?.workspaceSeatLimit || 10;
            if (existingCompanyUsers >= seatLimit) {
                throw new common_1.UnauthorizedException(`Company workspace user limit reached. Current limit is ${seatLimit} users.`);
            }
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userRepo.save(this.userRepo.create({
            displayId: `USR-${String(count + 1001).padStart(4, '0')}`,
            email: dto.email.toLowerCase().trim(),
            passwordHash,
            tenantId,
            workspaceType,
            workspaceSeatLimit: workspaceType === 'company' ? 10 : 1,
            companyName: dto.companyName || null,
            firstName: dto.firstName || null,
            lastName: dto.lastName || null,
            role: count === 0 ? 'owner' : 'inspector',
        }));
        return {
            token: this.sign(user),
            user: {
                id: user.id,
                displayId: user.displayId,
                email: user.email,
                tenantId: user.tenantId,
                workspaceType: user.workspaceType,
                companyName: user.companyName,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
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
    async getWorkspaceSummary(authHeader) {
        const auth = this.getAuthContext(authHeader);
        const currentUsers = await this.userRepo.count({
            where: { tenantId: auth.tenantId },
        });
        const pendingInvites = await this.inviteRepo.count({
            where: { tenantId: auth.tenantId, status: 'pending' },
        });
        const owner = await this.userRepo.findOne({
            where: { tenantId: auth.tenantId, role: 'owner' },
        });
        const seatLimit = owner?.workspaceSeatLimit || 1;
        return {
            tenantId: auth.tenantId,
            workspaceType: owner?.workspaceType || 'individual',
            companyName: owner?.companyName || auth.tenantId,
            seatLimit,
            usedSeats: currentUsers,
            pendingInvites,
            availableSeats: Math.max(seatLimit - currentUsers - pendingInvites, 0),
            nextSeatPackSize: 10,
        };
    }
    async getWorkspaceUsers(authHeader) {
        const auth = this.getAuthContext(authHeader);
        const users = await this.userRepo.find({
            where: { tenantId: auth.tenantId },
            order: { createdAt: 'ASC' },
        });
        return {
            users: users.map((user) => ({
                id: user.id,
                displayId: user.displayId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
                role: user.role,
                workspaceType: user.workspaceType,
                companyName: user.companyName,
            })),
        };
    }
    async createInvite(authHeader, dto) {
        const auth = this.getAuthContext(authHeader);
        if (!['owner', 'admin'].includes(auth.role)) {
            throw new common_1.UnauthorizedException('Only owners and admins can invite users.');
        }
        const inviter = await this.userRepo.findOne({ where: { id: auth.sub } });
        if (!inviter || inviter.workspaceType !== 'company') {
            throw new common_1.UnauthorizedException('Invites are only available for company workspaces.');
        }
        const currentUsers = await this.userRepo.count({ where: { tenantId: inviter.tenantId } });
        const pendingInvites = await this.inviteRepo.count({
            where: { tenantId: inviter.tenantId, status: 'pending' },
        });
        if (currentUsers + pendingInvites >= inviter.workspaceSeatLimit) {
            throw new common_1.UnauthorizedException(`Workspace seat limit reached. Current limit is ${inviter.workspaceSeatLimit} users.`);
        }
        const inviteToken = crypto.randomBytes(24).toString('hex');
        const email = dto.email.toLowerCase().trim();
        const invite = await this.inviteRepo.save(this.inviteRepo.create({
            inviteToken,
            email,
            tenantId: inviter.tenantId,
            companyName: inviter.companyName || inviter.tenantId,
            role: dto.role || 'inspector',
            invitedByUserId: inviter.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        }));
        const appUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
        const inviteLink = `${appUrl}/tabs/register?invite=${inviteToken}`;
        await this.emailService.sendWorkspaceInvite({
            to: email,
            companyName: invite.companyName,
            inviteLink,
            role: invite.role,
        });
        return {
            ok: true,
            message: 'Invite created and email queued.',
            inviteToken: process.env.NODE_ENV === 'production' ? undefined : inviteToken,
            invite,
        };
    }
    async acceptInvite(dto) {
        const invite = await this.inviteRepo.findOne({
            where: { inviteToken: dto.inviteToken, status: 'pending' },
        });
        if (!invite || invite.expiresAt.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Invalid or expired invite.');
        }
        if (!this.validatePassword(dto.password)) {
            throw new common_1.UnauthorizedException('Password must be at least 8 characters and include letters, numbers, and a special character.');
        }
        const existingUser = await this.userRepo.findOne({
            where: { email: invite.email },
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('A user with this email already exists.');
        }
        const owner = await this.userRepo.findOne({
            where: { tenantId: invite.tenantId, role: 'owner' },
        });
        const currentUsers = await this.userRepo.count({ where: { tenantId: invite.tenantId } });
        const pendingInvites = await this.inviteRepo.count({
            where: { tenantId: invite.tenantId, status: 'pending' },
        });
        const seatLimit = owner?.workspaceSeatLimit || 10;
        if (currentUsers >= seatLimit || currentUsers + pendingInvites > seatLimit) {
            throw new common_1.UnauthorizedException(`Workspace seat limit reached. Current limit is ${seatLimit} users.`);
        }
        const count = await this.userRepo.count();
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userRepo.save(this.userRepo.create({
            displayId: `USR-${String(count + 1001).padStart(4, '0')}`,
            email: invite.email,
            passwordHash,
            tenantId: invite.tenantId,
            workspaceType: 'company',
            workspaceSeatLimit: seatLimit,
            companyName: invite.companyName,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: invite.role,
        }));
        invite.status = 'accepted';
        await this.inviteRepo.save(invite);
        return {
            token: this.sign(user),
            user: {
                id: user.id,
                displayId: user.displayId,
                email: user.email,
                tenantId: user.tenantId,
                workspaceType: user.workspaceType,
                companyName: user.companyName,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    hashResetToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    validatePassword(password) {
        return (password.length >= 8 &&
            /[A-Za-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password));
    }
    async requestPasswordReset(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const user = await this.userRepo.findOne({
            where: { email: normalizedEmail },
        });
        const safeResponse = {
            ok: true,
            message: 'If an account exists, password reset instructions have been created.',
        };
        if (!user)
            return safeResponse;
        const token = crypto.randomBytes(32).toString('hex');
        user.passwordResetTokenHash = this.hashResetToken(token);
        user.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
        await this.userRepo.save(user);
        return {
            ...safeResponse,
            devResetToken: process.env.NODE_ENV === 'production' ? undefined : token,
        };
    }
    async confirmPasswordReset(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        if (!this.validatePassword(dto.newPassword)) {
            throw new common_1.UnauthorizedException('Password must be at least 8 characters and include letters, numbers, and a special character.');
        }
        const user = await this.userRepo.findOne({
            where: { email: normalizedEmail },
        });
        if (!user ||
            !user.passwordResetTokenHash ||
            !user.passwordResetExpiresAt ||
            user.passwordResetExpiresAt.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const incomingHash = this.hashResetToken(dto.token);
        if (incomingHash !== user.passwordResetTokenHash) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
        user.passwordResetTokenHash = null;
        user.passwordResetExpiresAt = null;
        await this.userRepo.save(user);
        return {
            ok: true,
            message: 'Password reset successful. Please sign in.',
        };
    }
    async resetUsers() {
        if (process.env.NODE_ENV === 'production') {
            throw new common_1.UnauthorizedException('Reset not allowed in production.');
        }
        await this.userRepo.clear();
        return { ok: true, message: 'All users deleted.' };
    }
    async login(dto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return {
            token: this.sign(user),
            user: {
                id: user.id,
                displayId: user.displayId,
                email: user.email,
                tenantId: user.tenantId,
                workspaceType: user.workspaceType,
                companyName: user.companyName,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(workspace_invite_entity_1.WorkspaceInvite)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map