import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class DiscussionThread {  // Extend Document

    title: string;
    discussion_id: string;
    description: string;
    project_id: Types.ObjectId;
    created_by: Types.ObjectId;
    discussion_replies: any[];
}

