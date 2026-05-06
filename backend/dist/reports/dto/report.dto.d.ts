export declare class CreateReportDto {
    tenantId?: string;
    createdByUserId?: string;
    siteId?: string;
    sourceType?: string;
    eventDatetime?: string;
    eventTypeCode?: string;
    title?: string;
    narrative?: string;
    reportStatus?: string;
    hazardDescription?: string;
    area?: string;
    equipment?: string;
    workActivity?: string;
    severity?: string;
    immediateDanger?: boolean;
    notes?: string;
    likelyStandards?: any[];
}
export declare class UpdateReportDto {
    siteId?: string;
    sourceType?: string;
    eventDatetime?: string;
    eventTypeCode?: string;
    title?: string;
    narrative?: string;
    reportStatus?: string;
    hazardDescription?: string;
    area?: string;
    equipment?: string;
    workActivity?: string;
    severity?: string;
    immediateDanger?: boolean;
    notes?: string;
    likelyStandards?: any[];
}
export declare class CreateReportAttachmentDto {
    uri: string;
    mimeType?: string;
    fileName?: string;
}
export declare class AddReportEvidenceDto {
    attachments: CreateReportAttachmentDto[];
}
