import { Document } from "mongoose";
export declare class Project extends Document {
    project_name: string;
    project_id: number;
    is_approved: boolean;
    description: string;
    is_completed: boolean;
    cap: number;
    start_date: Date;
    end_date: Date;
    discussion_threads: Object[];
    tags: Object[];
    project_owner: number;
    students_enrolled: Object[];
    tasks: Object[];
    project_application: Object[];
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
