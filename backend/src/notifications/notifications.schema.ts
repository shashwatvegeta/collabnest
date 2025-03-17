import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: mongoose.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  receivers: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  message: string;

  @Prop([
    {
      readerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now },
    },
  ])
  readBy: { readerId: mongoose.Types.ObjectId; read_at: Date }[];
}

export const NotificationsSchema = SchemaFactory.createForClass(Notification);