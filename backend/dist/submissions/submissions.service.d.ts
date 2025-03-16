import { Model, Types } from 'mongoose';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submissions } from './submissions.schema';
import { Task } from 'src/task/task.schema';
export declare class SubmissionsService {
    private submissionModel;
    private taskModel;
    constructor(submissionModel: Model<Submissions>, taskModel: Model<Task>);
    create(createSubmissionDto: CreateSubmissionDto, taskId: string): Promise<import("mongoose").Document<unknown, {}, Submissions> & Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(task_id: string): Promise<Types.ObjectId[]>;
    findOne(task_id: string, submission_id: string): Promise<import("mongoose").Document<unknown, {}, Submissions> & Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(task_id: string, submission_id: string): Promise<(import("mongoose").Document<unknown, {}, Submissions> & Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
