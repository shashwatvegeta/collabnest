import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Enables createdAt and updatedAt fields
export class Feedback extends Document {
    @Prop({ ref: 'User', required: true }) // The user who gives the feedback, mostly it will be the owner
    user_id: Types.ObjectId;

    @Prop({ ref: 'Submissions', required: true }) // Reference to the submission this feedback belongs to
    submission_id: Types.ObjectId;

    @Prop({ required: true })
    feedback_message: string;

    @Prop({ ref: 'File', required: true })
    files: Types.ObjectId[];
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);