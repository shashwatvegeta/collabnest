import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DiscussionThread extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    discussion_id: Types.ObjectId;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, required: true })
    project_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    created_by: Types.ObjectId;

    @Prop({ type: [Object], default: [] })
    replies: Array<{
        content: string;
        created_by: Types.ObjectId;
        created_at: Date;
    }>;
}

