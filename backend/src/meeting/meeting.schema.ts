import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Meeting extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  scheduled_start: Date;

  @Prop({ required: true })
  scheduled_end: Date;

  @Prop({ required: true })
  join_url: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
