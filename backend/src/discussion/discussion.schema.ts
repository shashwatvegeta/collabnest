import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Discussion extends Document {
    @Prop({ type: Types.ObjectId, required: true })
    Post_Id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Discussion' })
    discussion_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    posted_by: Types.ObjectId;

    @Prop({ required: true })
    reply_message: string;

    @Prop({ type: Date, default: Date.now })
    posted_at: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);