import { Types } from 'mongoose';
export declare class DiscussionThread {
    title: string;
    discussion_id: string;
    description: string;
    project_id: Types.ObjectId;
    created_by: Types.ObjectId;
    discussion_replies: any[];
}
