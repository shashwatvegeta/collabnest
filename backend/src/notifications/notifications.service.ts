import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './notifications.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) { }

  async createNotification(senderId: string, receiverIds: string[], message: string): Promise<Notification> {
    if (!Types.ObjectId.isValid(senderId)) {
      throw new BadRequestException('Invalid sender ID.');
    }

    if (!receiverIds || receiverIds.length === 0) {
      throw new BadRequestException('At least one receiver ID is required.');
    }

    const invalidReceiverIds = receiverIds.filter(id => !Types.ObjectId.isValid(id));
    if (invalidReceiverIds.length > 0) {
      throw new BadRequestException(`Invalid receiver IDs: ${invalidReceiverIds.join(', ')}`);
    }

    if (!message || message.trim() === '') {
      throw new BadRequestException('Message cannot be empty.');
    }

    const notification = new this.notificationModel({
      sender: new Types.ObjectId(senderId),
      receivers: receiverIds.map(id => new Types.ObjectId(id)),
      message,
      readBy: [],
    });

    return notification.save();
  }

  async getSentNotifications(userId: string): Promise<Notification[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    return this.notificationModel.find({ sender: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async getReceivedNotifications(userId: string): Promise<Notification[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    return this.notificationModel
      .find({ receivers: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notificationId: string, readerId: string): Promise<Notification> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException('Invalid notification ID.');
    }
    if (!Types.ObjectId.isValid(readerId)) {
      throw new BadRequestException('Invalid reader ID.');
    }

    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        receivers: new Types.ObjectId(readerId), // Ensure readerId exists in receivers
        'readBy.readerId': { $ne: new Types.ObjectId(readerId) }, // Prevent duplicate entries
      },
      {
        $push: { readBy: { readerId: new Types.ObjectId(readerId), readAt: new Date() } }, // Add to readBy array
      },
      { new: true },
    ).exec();

    if (!notification) {
      throw new NotFoundException('Notification not found or already marked as read.');
    }

    return notification;
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    return this.notificationModel.find({
      receivers: new Types.ObjectId(userId),
      'readBy.readerId': { $ne: new Types.ObjectId(userId) },
    }).sort({ createdAt: -1 }).exec();
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    const result = await this.notificationModel.updateMany(
      {
        receivers: new Types.ObjectId(userId),
        'readBy.readerId': { $ne: new Types.ObjectId(userId) },
      },
      {
        $push: { readBy: { readerId: new Types.ObjectId(userId), readAt: new Date() } },
      },
    );

    return { modifiedCount: result.modifiedCount };
  }
}
