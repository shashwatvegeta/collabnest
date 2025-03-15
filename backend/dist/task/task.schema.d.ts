import { Document, Types } from 'mongoose';
export declare class Task extends Document {
    title: string;
    description: string;
    deadline: Date;
    status: string;
    submissions: Types.ObjectId[];
    meetings: Types.ObjectId[];
    assigned_to: Types.ObjectId[];
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task> & Task & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>> & import("mongoose").FlatRecord<Task> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
