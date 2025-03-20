import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Discussion extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    Post_Id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    discussion_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    posted_by: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    reply_message: string;

    @Prop({ type: Date, default: Date.now })
    posted_at: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
export type DiscussionDocument = Discussion & Document;