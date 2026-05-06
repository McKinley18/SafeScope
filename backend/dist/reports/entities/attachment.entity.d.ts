import { Report } from './report.entity';
export declare class ReportAttachment {
    id: string;
    reportId: string;
    report: Report;
    imageUri: string;
    mimeType: string;
    fileName: string;
    createdAt: Date;
}
