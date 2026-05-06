export declare class CorrectiveAction {
    id: string;
    displayId: string;
    reportId: string;
    tenantId: string;
    classificationId: string;
    title: string;
    description: string;
    ownerUserId: string;
    assignedToUserId: string;
    assignedToName: string;
    priorityCode: 'low' | 'medium' | 'high' | 'urgent';
    statusCode: 'open' | 'in_progress' | 'closed' | 'cancelled';
    dueDate: Date;
    closureNotes: string;
    verifiedByUserId: string;
    verifiedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    siteId: string;
}
