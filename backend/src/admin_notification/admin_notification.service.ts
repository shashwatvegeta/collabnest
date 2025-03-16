import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './admin_notification.schema';
import { CreateNotificationDto } from './dto/create-admin_notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const createdNotification = new this.notificationModel(createNotificationDto);
    return createdNotification.save();
  }

  async findAllForAdmin(adminId: number): Promise<Notification[]> {
    return this.notificationModel.find({ 
      receiver_ids: adminId,
      isApproved: false 
    }).exec();
  }

  async approveNotification(id: string, adminId: number): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    notification.isApproved = true;
    return notification.save();
  }
}
