import { Document, Types } from "mongoose";
export declare class Project extends Document {
    project_id: Types.ObjectId;
    project_name: string;
    is_approved: string;
    description: string;
    is_completed: boolean;
    cap: number;
    start_date: Date;
    end_date: Date;
    discussion_threads: Object[];
    tags: Object[];
    project_owner: Types.ObjectId;
    mentor_email: string;
    students_enrolled: Types.ObjectId[];
    tasks: Types.ObjectId[];
    project_application: Types.ObjectId[];
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project> & Project & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>> & import("mongoose").FlatRecord<Project> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
