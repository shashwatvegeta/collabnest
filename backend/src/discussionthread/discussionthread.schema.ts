import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class DiscussionThread extends Document {
    @Prop({ required: true })
    discussion_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    project_id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    created_by: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [Object], default: [] })
    replies: Array<{
        content: string;
        created_by: string;
        created_at: Date;
        created_by_username: string;
    }>;
}

export const DiscussionThreadSchema = SchemaFactory.createForClass(DiscussionThread);
export type DiscussionThreadDocument = DiscussionThread & Document;