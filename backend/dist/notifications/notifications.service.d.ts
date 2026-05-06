import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
export declare class NotificationsService {
    private notificationRepo;
    constructor(notificationRepo: Repository<Notification>);
    private getAuthContext;
    create(data: Partial<Notification>): Promise<Notification>;
    findExistingForEntity(data: {
        tenantId: string;
        userId: string;
        type: Notification['type'];
        entityType: string;
        entityId: string;
    }): Promise<Notification>;
    findMine(authHeader: string): Promise<Notification[]>;
    markRead(authHeader: string, id: string): Promise<Notification>;
}
