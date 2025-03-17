import { Types } from "mongoose";

export class CreateNotificationDto {
  sender_id: number;
  receiver_ids: number[];
  message: string;
  project_id: Types.ObjectId;
}