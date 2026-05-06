import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findMine(authorization: string): Promise<import("./notification.entity").Notification[]>;
    markRead(authorization: string, id: string): Promise<import("./notification.entity").Notification>;
}
