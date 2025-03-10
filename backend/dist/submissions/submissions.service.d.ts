import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submissions } from './submissions.schema';
import { Model } from 'mongoose';
export declare class SubmissionsService {
    private submissionModel;
    constructor(submissionModel: Model<Submissions>);
    create(createSubmissionDto: CreateSubmissionDto): Promise<import("mongoose").Document<unknown, {}, Submissions> & Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Submissions> & Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, Submissions> & Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, Submissions> & Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
