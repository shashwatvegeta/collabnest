import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Project extends Document {
    @Prop({ required: true })
    project_name: string;

    @Prop({ required: true })
    is_approved: boolean;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    is_completed: boolean;

    @Prop({ required: true })
    cap: number;

    @Prop({ required: true })
    start_date: Date;

    @Prop({ required: true })
    end_date: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }] })
    project_applications: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'User' })
    owner_id: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);