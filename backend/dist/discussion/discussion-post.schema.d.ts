import { Document, Types } from 'mongoose';
export declare class DiscussionPost extends Document {
    discussion_id: Types.ObjectId;
    content: string;
    author: Types.ObjectId;
    created_at: Date;
}
export declare const DiscussionPostSchema: import("mongoose").Schema<DiscussionPost, import("mongoose").Model<DiscussionPost, any, any, any, Document<unknown, any, DiscussionPost> & DiscussionPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DiscussionPost, Document<unknown, {}, import("mongoose").FlatRecord<DiscussionPost>> & import("mongoose").FlatRecord<DiscussionPost> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
