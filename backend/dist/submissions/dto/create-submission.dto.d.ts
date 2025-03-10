import { Types } from 'mongoose';
export declare class CreateSubmissionDto {
    submission_id: Types.ObjectId;
    user_id: Types.ObjectId;
    submission_date: Date;
    submission_message: string;
    files: Types.ObjectId[];
    feedback?: Types.ObjectId;
}
