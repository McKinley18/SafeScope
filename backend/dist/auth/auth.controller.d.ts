import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
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
    login(body: {
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
    getWorkspaceUsers(authorization: string): Promise<{
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
    getWorkspaceSummary(authorization: string): Promise<{
        tenantId: string;
        workspaceType: "individual" | "company";
        companyName: string;
        seatLimit: number;
        usedSeats: number;
        pendingInvites: number;
        availableSeats: number;
        nextSeatPackSize: number;
    }>;
    createInvite(authorization: string, body: {
        email: string;
        role?: 'admin' | 'manager' | 'inspector' | 'viewer';
    }): Promise<{
        ok: boolean;
        message: string;
        inviteToken: string;
        invite: import("./entities/workspace-invite.entity").WorkspaceInvite;
    }>;
    acceptInvite(body: {
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
    requestPasswordReset(body: {
        email: string;
    }): Promise<{
        ok: boolean;
        message: string;
    } | {
        devResetToken: string;
        ok: boolean;
        message: string;
    }>;
    confirmPasswordReset(body: {
        email: string;
        token: string;
        newPassword: string;
    }): Promise<{
        ok: boolean;
        message: string;
    }>;
    resetUsers(secret: string): Promise<{
        ok: boolean;
        message: string;
    }>;
}
