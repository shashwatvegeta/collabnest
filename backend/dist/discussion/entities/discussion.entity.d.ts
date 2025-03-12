import { Types } from 'mongoose';
export declare class DiscussionReply {
    Post_Id: Types.ObjectId;
    discussion_id: Types.ObjectId;
    posted_by: Types.ObjectId;
    reply_message: string;
    posted_at: Date;
}
