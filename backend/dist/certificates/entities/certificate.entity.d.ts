import { Types } from 'mongoose';
export declare class Certificate {
    certificate_id: string;
    project_id: Types.ObjectId;
    submission_id: Types.ObjectId;
    url: string;
    generated_at: Date;
}
