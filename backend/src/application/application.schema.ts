import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Application extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId; // Required (An application must be linked to a user)

    @Prop({ type: Types.ObjectId, ref: 'Project', required: true }) 
    project_id: Types.ObjectId; // Required (An application must be linked to a project)

    // @Prop({ type: Types.ObjectId, ref: 'User', required: true }) 
    // user_id: Types.ObjectId; // Required (An application must be linked to a user)

    @Prop({ type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'], required: true }) 
    status: string; // Required (An application must have a status)

    @Prop({ required: false }) 
    motivation_statement?: string; // Optional (Not always provided)

    @Prop({ required: true }) 
    resume_link: string; // Required (A resume link is always needed)

    @Prop({ required: true, default: Date.now }) 
    submission_date: Date; // Required (Every application must have a submission date)

    @Prop({ required: false }) 
    review_date?: Date; // Optional (Only set when reviewed)

    @Prop({ required: false }) 
    rejection_reason?: string; // Optional (Only needed if rejected)

    @Prop({ required: false }) 
    approval_notes?: string; // Optional (Only needed if approved)
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);