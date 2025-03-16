import { Module } from "@nestjs/common";
import { NotificationService } from "./admin_notification.service";
import { NotificationController } from "./admin_notification.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema } from "./admin_notification.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Notification", schema: NotificationSchema }]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}