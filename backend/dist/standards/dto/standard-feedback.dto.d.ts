export declare class StandardFeedbackDto {
    reportId?: string;
    standardId: string;
    citation: string;
    action: 'accepted' | 'rejected' | 'changed' | 'flagged';
    replacementCitation?: string;
    notes?: string;
}
