import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Discussion extends Document {
    @Prop({ type: Types.ObjectId, required: true })
    discussion_id: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, required: true })
    created_by: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'DiscussionPost' }] })
    'Discussion Replies': Types.ObjectId[];
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);