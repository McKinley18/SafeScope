import { ExecutiveService } from "../executive/executive.service";
export declare class PdfService {
    private readonly executiveService;
    constructor(executiveService: ExecutiveService);
    generateExecutivePdf(data: any): Promise<Buffer>;
}
