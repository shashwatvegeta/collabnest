import { UserProjectApplicationService } from './user-project-application.service';
import { UpdateApplicationDto } from '../application/dto/update-application.dto';
export declare class UserProjectApplicationController {
    private readonly userProjectApplicationService;
    constructor(userProjectApplicationService: UserProjectApplicationService);
    findAll(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../application/application.schema").Application> & import("../application/application.schema").Application & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(userId: string, applicationId: string): Promise<(import("mongoose").Document<unknown, {}, import("../application/application.schema").Application> & import("../application/application.schema").Application & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(userId: string, projectId: string, applicationId: string, updateApplicationDto: UpdateApplicationDto): Promise<(import("mongoose").Document<unknown, {}, import("../application/application.schema").Application> & import("../application/application.schema").Application & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
