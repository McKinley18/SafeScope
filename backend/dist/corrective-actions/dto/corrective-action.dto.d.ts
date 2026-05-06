export declare class CreateCorrectiveActionDto {
    reportId: string;
    classificationId: string;
    title: string;
    description: string;
    priorityCode: 'low' | 'medium' | 'high' | 'urgent';
    assignedToUserId: string;
    assignedToName: string;
    dueDate: string;
}
export declare class CloseCorrectiveActionDto {
    closureNotes: string;
}
