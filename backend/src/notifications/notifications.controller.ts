import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
        const { senderId, receiverIds, message } = createNotificationDto;
        const notification = await this.notificationService.createNotification(
            senderId,
            receiverIds,
            message,
        );
        return { message: 'Notification created successfully', notification };
    }

    @Get('sent/:userId')
    async getSentNotifications(@Param('userId') userId: string) {
        const notifications = await this.notificationService.getSentNotifications(userId);
        return { message: 'Sent notifications retrieved successfully', notifications };
    }

    @Get('received/:userId')
    async getReceivedNotifications(@Param('userId') userId: string) {
        const notifications = await this.notificationService.getReceivedNotifications(userId);
        return { message: 'Received notifications retrieved successfully', notifications };
    }

    @Patch('read')
    async markAsRead(@Body() markAsReadDto: MarkAsReadDto) {
        const { notificationId, readerId } = markAsReadDto;
        const updatedNotification = await this.notificationService.markAsRead(
            notificationId,
            readerId,
        );
        return { message: 'Notification marked as read successfully', updatedNotification };
    }

    @Get(':userId/unread')
    async getUnreadNotifications(@Param('userId') userId: string) {
        const unreadNotifications = await this.notificationService.getUnreadNotifications(userId);
        return { message: 'Unread notifications retrieved successfully', unreadNotifications };
    }

    @Patch(':userId/read-all')
    async markAllAsRead(@Param('userId') userId: string) {
        const result = await this.notificationService.markAllAsRead(userId);
        return {
            message: `${result.modifiedCount} notifications marked as read successfully`,
            modifiedCount: result.modifiedCount,
        };
    }
}