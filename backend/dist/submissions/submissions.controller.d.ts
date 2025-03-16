import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    create(createSubmissionDto: CreateSubmissionDto, task_id: string): Promise<import("mongoose").Document<unknown, {}, import("./submissions.schema").Submissions> & import("./submissions.schema").Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(task_id: string): Promise<import("mongoose").Types.ObjectId[]>;
    findOne(submission_id: string, task_id: string): Promise<import("mongoose").Document<unknown, {}, import("./submissions.schema").Submissions> & import("./submissions.schema").Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(submission_id: string, task_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./submissions.schema").Submissions> & import("./submissions.schema").Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
