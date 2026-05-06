import { Repository } from "typeorm";
import { ControlVerification } from "./entities/control-verification.entity";
export declare class ControlVerificationsService {
    private repo;
    constructor(repo: Repository<ControlVerification>);
    saveMany(reportId: string, controls: any[]): Promise<ControlVerification[]>;
    create(reportId: string, dto: any): Promise<{
        reportId: string;
        control: any;
        status: any;
        notes: any;
    } & ControlVerification>;
    getForReport(reportId: string): Promise<ControlVerification[]>;
}
