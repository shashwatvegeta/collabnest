import { Document, Types } from 'mongoose';
export declare class DiscussionThread extends Document {
    title: string;
    discussion_id: Types.ObjectId;
    description: string;
    project_id: Types.ObjectId;
    created_by: Types.ObjectId;
    replies: Array<{
        content: string;
        created_by: Types.ObjectId;
        created_at: Date;
    }>;
}
