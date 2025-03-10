import { Document } from "mongoose";
export declare class Discussion extends Document {
    title: string;
    discussion_id: Object[];
    Projects: Object[];
    description: string;
    created_by: Object[];
    Discussion_Replies: Object[];
}
export declare const DiscussionSchema: import("mongoose").Schema<Discussion, import("mongoose").Model<Discussion, any, any, any, Document<unknown, any, Discussion> & Discussion & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Discussion, Document<unknown, {}, import("mongoose").FlatRecord<Discussion>> & import("mongoose").FlatRecord<Discussion> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
