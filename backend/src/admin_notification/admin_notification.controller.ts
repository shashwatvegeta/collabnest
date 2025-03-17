import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { NotificationService } from './admin_notification.service';
import { CreateNotificationDto } from './dto/create-admin_notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get('admin/:adminId')
  findAllForAdmin(@Param('adminId') adminId: string) {
    return this.notificationService.findAllForAdmin(+adminId);
  }

  @Put(':id/approve/:adminId')
  approveNotification(
    @Param('id') id: string,
    @Param('adminId') adminId: string
  ) {
    return this.notificationService.approveNotification(id, +adminId);
  }
}