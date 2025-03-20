import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export declare class DiscussionThread extends Document {
    discussion_id: mongoose.Schema.Types.ObjectId;
    project_id: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    created_by: mongoose.Schema.Types.ObjectId;
    replies: Array<{
        content: string;
        created_by: string;
        created_at: Date;
        created_by_username: string;
    }>;
}
export declare const DiscussionThreadSchema: mongoose.Schema<DiscussionThread, mongoose.Model<DiscussionThread, any, any, any, Document<unknown, any, DiscussionThread> & DiscussionThread & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, DiscussionThread, Document<unknown, {}, mongoose.FlatRecord<DiscussionThread>> & mongoose.FlatRecord<DiscussionThread> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export type DiscussionThreadDocument = DiscussionThread & Document;
