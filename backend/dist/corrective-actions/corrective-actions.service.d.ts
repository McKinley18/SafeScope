import { Repository } from 'typeorm';
import { CorrectiveAction } from './entities/corrective-action.entity';
import { CreateCorrectiveActionDto, CloseCorrectiveActionDto } from './dto/corrective-action.dto';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CorrectiveActionsService {
    private actionRepo;
    private auditService;
    private notificationsService;
    constructor(actionRepo: Repository<CorrectiveAction>, auditService: AuditService, notificationsService: NotificationsService);
    private getAuthContext;
    private buildFilter;
    findAll(authHeader: string, options: {
        page: number;
        limit: number;
        statusCode?: string;
        priorityCode?: string;
        assignedToMe?: boolean;
    }): Promise<{
        data: CorrectiveAction[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    export(statusCode?: string, priorityCode?: string): Promise<CorrectiveAction[]>;
    create(authHeader: string, dto: CreateCorrectiveActionDto): Promise<CorrectiveAction>;
    updateStatus(authHeader: string, id: string, body: {
        statusCode: 'open' | 'in_progress' | 'closed' | 'cancelled';
        closureNotes?: string;
    }): Promise<CorrectiveAction>;
    generateDueDateAlerts(authHeader: string): Promise<{
        ok: boolean;
        created: number;
    }>;
    close(id: string, dto: CloseCorrectiveActionDto): Promise<CorrectiveAction>;
}
