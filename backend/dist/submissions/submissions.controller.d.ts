import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    create(createSubmissionDto: CreateSubmissionDto): Promise<import("mongoose").Document<unknown, {}, import("./submissions.schema").Submissions> & import("./submissions.schema").Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./submissions.schema").Submissions> & import("./submissions.schema").Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./submissions.schema").Submissions> & import("./submissions.schema").Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./submissions.schema").Submissions> & import("./submissions.schema").Submissions & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
