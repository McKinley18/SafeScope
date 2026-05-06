export declare class WorkspaceInvite {
    id: string;
    inviteToken: string;
    email: string;
    tenantId: string;
    companyName: string;
    role: 'owner' | 'admin' | 'manager' | 'inspector' | 'viewer';
    status: 'pending' | 'accepted' | 'cancelled';
    invitedByUserId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
