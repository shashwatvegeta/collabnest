import { Types } from "mongoose";
export declare class CreateApplicationDto {
    project_id: Types.ObjectId;
    status: string;
    motivation_statement?: string;
    resume_link: string;
    submission_date: Date;
}
