import { ControlVerificationsService } from "./control-verifications.service";
export declare class ControlVerificationsController {
    private svc;
    constructor(svc: ControlVerificationsService);
    verify(reportId: string, body: {
        control: string;
        status: "present" | "missing";
        notes?: string;
    }): Promise<{
        reportId: string;
        control: any;
        status: any;
        notes: any;
    } & import("./entities/control-verification.entity").ControlVerification>;
    get(reportId: string): Promise<import("./entities/control-verification.entity").ControlVerification[]>;
}
