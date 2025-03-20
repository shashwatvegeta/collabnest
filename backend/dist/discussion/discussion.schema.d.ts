import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export declare class Discussion extends Document {
    Post_Id: mongoose.Schema.Types.ObjectId;
    discussion_id: mongoose.Schema.Types.ObjectId;
    posted_by: mongoose.Schema.Types.ObjectId;
    reply_message: string;
    posted_at: Date;
}
export declare const DiscussionSchema: mongoose.Schema<Discussion, mongoose.Model<Discussion, any, any, any, Document<unknown, any, Discussion> & Discussion & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Discussion, Document<unknown, {}, mongoose.FlatRecord<Discussion>> & mongoose.FlatRecord<Discussion> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export type DiscussionDocument = Discussion & Document;
