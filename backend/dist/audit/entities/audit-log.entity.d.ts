export declare class AuditLog {
    id: string;
    actorUserId: string;
    tenantId: string;
    entityType: string;
    entityId: string;
    actionCode: string;
    beforeJson: any;
    afterJson: any;
    metadataJson: any;
    createdAt: Date;
}
