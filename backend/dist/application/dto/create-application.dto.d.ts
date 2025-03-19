import { Types } from "mongoose";
export declare class CreateApplicationDto {
    user_id: Types.ObjectId;
    project_id: Types.ObjectId;
    status: string;
    motivation_statement?: string;
    resume_link: string;
    submission_date: Date;
}
