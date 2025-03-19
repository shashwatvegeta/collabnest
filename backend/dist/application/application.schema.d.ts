import { Document, Types } from 'mongoose';
export declare class Application extends Document {
    user_id: Types.ObjectId;
    project_id: Types.ObjectId;
    status: string;
    motivation_statement?: string;
    resume_link: string;
    submission_date: Date;
    review_date?: Date;
    rejection_reason?: string;
    approval_notes?: string;
}
export declare const ApplicationSchema: import("mongoose").Schema<Application, import("mongoose").Model<Application, any, any, any, Document<unknown, any, Application> & Application & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Application, Document<unknown, {}, import("mongoose").FlatRecord<Application>> & import("mongoose").FlatRecord<Application> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
