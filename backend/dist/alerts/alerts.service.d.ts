import { Repository } from 'typeorm';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AlertsService {
    private actionRepo;
    private notificationsService;
    private readonly logger;
    constructor(actionRepo: Repository<CorrectiveAction>, notificationsService: NotificationsService);
    scanDueDates(): Promise<void>;
}
