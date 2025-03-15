import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Task extends Document {
    
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    deadline: Date;

    @Prop({
        enum: ['Pending', 'In Progress', 'Completed'],
        required: true
    })
    status: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Submission' }], default: [] })
    submissions: Types.ObjectId[];


    @Prop({ type: [{ type: Types.ObjectId, ref: 'Meeting' }], default: [] })
    meetings: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    assigned_to: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);