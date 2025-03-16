import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Submissions extends Document {
  @Prop({ ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({required: true, default: Date.now })
  submission_date: Date;

  @Prop({required: true })
  submission_message: string;

  @Prop({ ref: 'File', required: true })
  files: Types.ObjectId[];

  @Prop({ ref: 'Feedback', required: false })
  feedback: Types.ObjectId;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submissions);
