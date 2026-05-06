export declare class ControlVerification {
    id: string;
    reportId: string;
    control: string;
    status: "present" | "missing";
    notes?: string;
    createdAt: Date;
}
