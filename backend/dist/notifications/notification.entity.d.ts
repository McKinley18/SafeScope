export declare class Notification {
    id: string;
    tenantId: string;
    userId: string;
    type: 'assigned_action' | 'overdue_action' | 'due_soon_action' | 'system';
    title: string;
    message: string;
    entityType: string;
    entityId: string;
    read: boolean;
    createdAt: Date;
}
