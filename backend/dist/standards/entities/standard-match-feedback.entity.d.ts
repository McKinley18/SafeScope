export declare class StandardMatchFeedback {
    id: string;
    reportId?: string;
    standardId: string;
    citation: string;
    action: 'accepted' | 'rejected' | 'changed' | 'flagged';
    replacementCitation?: string;
    notes?: string;
    createdAt: Date;
}
