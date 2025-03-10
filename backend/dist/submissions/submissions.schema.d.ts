import { Document, Types } from 'mongoose';
export declare class Submissions extends Document {
    user_id: Types.ObjectId;
    submission_date: Date;
    submission_message: string;
    files: Types.ObjectId[];
    feedback: Types.ObjectId;
}
export declare const SubmissionSchema: import("mongoose").Schema<Submissions, import("mongoose").Model<Submissions, any, any, any, Document<unknown, any, Submissions> & Submissions & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Submissions, Document<unknown, {}, import("mongoose").FlatRecord<Submissions>> & import("mongoose").FlatRecord<Submissions> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
