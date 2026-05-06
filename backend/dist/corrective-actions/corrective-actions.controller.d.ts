import { CorrectiveActionsService } from './corrective-actions.service';
import { CreateCorrectiveActionDto } from './dto/corrective-action.dto';
export declare class CorrectiveActionsController {
    private readonly service;
    constructor(service: CorrectiveActionsService);
    findAll(authorization: string, page?: number, limit?: number, statusCode?: string, priorityCode?: string, assignedToMe?: string): Promise<{
        data: import("./entities/corrective-action.entity").CorrectiveAction[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    create(authorization: string, dto: CreateCorrectiveActionDto): Promise<import("./entities/corrective-action.entity").CorrectiveAction>;
    updateStatus(authorization: string, id: string, body: {
        statusCode: 'open' | 'in_progress' | 'closed' | 'cancelled';
        closureNotes?: string;
    }): Promise<import("./entities/corrective-action.entity").CorrectiveAction>;
    generateDueDateAlerts(authorization: string): Promise<{
        ok: boolean;
        created: number;
    }>;
    export(statusCode?: string, priorityCode?: string, format?: string): Promise<string | import("./entities/corrective-action.entity").CorrectiveAction[]>;
}
