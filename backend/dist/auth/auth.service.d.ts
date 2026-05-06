import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WorkspaceInvite } from './entities/workspace-invite.entity';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private userRepo;
    private inviteRepo;
    private emailService;
    constructor(userRepo: Repository<User>, inviteRepo: Repository<WorkspaceInvite>, emailService: EmailService);
    private sign;
    register(dto: {
        email: string;
        password: string;
        tenantId?: string;
        workspaceType?: 'individual' | 'company';
        companyName?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            displayId: string;
            email: string;
            tenantId: string;
            workspaceType: "individual" | "company";
            companyName: string;
            firstName: string;
            lastName: string;
            role: "owner" | "admin" | "inspector" | "manager" | "viewer";
        };
    }>;
    private getAuthContext;
    getWorkspaceSummary(authHeader: string): Promise<{
        tenantId: string;
        workspaceType: "individual" | "company";
        companyName: string;
        seatLimit: number;
        usedSeats: number;
        pendingInvites: number;
        availableSeats: number;
        nextSeatPackSize: number;
    }>;
    getWorkspaceUsers(authHeader: string): Promise<{
        users: {
            id: string;
            displayId: string;
            email: string;
            firstName: string;
            lastName: string;
            fullName: string;
            role: "owner" | "admin" | "inspector" | "manager" | "viewer";
            workspaceType: "individual" | "company";
            companyName: string;
        }[];
    }>;
    createInvite(authHeader: string, dto: {
        email: string;
        role?: 'admin' | 'manager' | 'inspector' | 'viewer';
    }): Promise<{
        ok: boolean;
        message: string;
        inviteToken: string;
        invite: WorkspaceInvite;
    }>;
    acceptInvite(dto: {
        inviteToken: string;
        firstName: string;
        lastName: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            displayId: string;
            email: string;
            tenantId: string;
            workspaceType: "individual" | "company";
            companyName: string;
            firstName: string;
            lastName: string;
            role: "owner" | "admin" | "inspector" | "manager" | "viewer";
        };
    }>;
    private hashResetToken;
    private validatePassword;
    requestPasswordReset(dto: {
        email: string;
    }): Promise<{
        ok: boolean;
        message: string;
    } | {
        devResetToken: string;
        ok: boolean;
        message: string;
    }>;
    confirmPasswordReset(dto: {
        email: string;
        token: string;
        newPassword: string;
    }): Promise<{
        ok: boolean;
        message: string;
    }>;
    resetUsers(): Promise<{
        ok: boolean;
        message: string;
    }>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            displayId: string;
            email: string;
            tenantId: string;
            workspaceType: "individual" | "company";
            companyName: string;
            firstName: string;
            lastName: string;
            role: "owner" | "admin" | "inspector" | "manager" | "viewer";
        };
    }>;
}
