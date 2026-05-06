export declare class User {
    id: string;
    displayId: string;
    email: string;
    passwordHash: string;
    passwordResetTokenHash: string;
    passwordResetExpiresAt: Date;
    tenantId: string;
    workspaceType: 'individual' | 'company';
    companyName: string;
    firstName: string;
    lastName: string;
    workspaceSeatLimit: number;
    role: 'owner' | 'admin' | 'manager' | 'inspector' | 'viewer';
    createdAt: Date;
    updatedAt: Date;
}
