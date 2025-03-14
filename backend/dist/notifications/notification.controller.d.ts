import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto): any;
    findAllByUser(userId: string): any;
    markAsRead(id: string): any;
    markAllAsRead(userId: string): any;
    remove(id: string): any;
}
