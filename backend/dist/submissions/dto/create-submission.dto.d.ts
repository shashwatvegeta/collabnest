import { Types } from 'mongoose';
export declare class CreateSubmissionDto {
    user_id: Types.ObjectId;
    submission_date: Date;
    submission_message?: string;
    files: Types.ObjectId[];
}
