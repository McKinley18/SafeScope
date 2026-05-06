export declare class Review {
    id: string;
    reportId: string;
    classificationId: string;
    reviewerUserId: string;
    reviewAction: 'approve' | 'modify_and_approve' | 'reject' | 'request_more_info';
    notes: string;
    beforeSnapshot: any;
    afterSnapshot: any;
    createdAt: Date;
}
