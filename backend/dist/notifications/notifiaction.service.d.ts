import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MailService } from '../mail/mail.service';
export declare class NotificationService {
    private notificationModel;
    private mailService;
    constructor(notificationModel: Model<Notification>, mailService: MailService);
    create(createNotificationDto: CreateNotificationDto): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAllByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markAsRead(id: string): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    markAllAsRead(userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
