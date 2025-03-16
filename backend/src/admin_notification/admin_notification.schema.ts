import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Notification extends Document {
  @Prop({ required: true })
  sender_id: number;

  @Prop({ required: true, type: [Number] })
  receiver_ids: number[];

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ required: true })
  project_id: Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);