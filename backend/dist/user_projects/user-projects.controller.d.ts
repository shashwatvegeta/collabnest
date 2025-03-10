import { UserProjectsService } from './user-projects.service';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { UpdateProjectDto } from '../project/dto/update-project.dto';
export declare class UserProjectsController {
    private readonly userProjectsService;
    constructor(userProjectsService: UserProjectsService);
    findAll(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../project/project.schema").Project> & import("../project/project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(userId: string, projectId: string): Promise<(import("mongoose").Document<unknown, {}, import("../project/project.schema").Project> & import("../project/project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    create(userId: string, createProjectDto: CreateProjectDto): Promise<import("mongoose").Document<unknown, {}, import("../project/project.schema").Project> & import("../project/project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(userId: string, projectId: string): Promise<(import("mongoose").Document<unknown, {}, import("../project/project.schema").Project> & import("../project/project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(userId: string, projectId: string, updateProjectDto: UpdateProjectDto): Promise<(import("mongoose").Document<unknown, {}, import("../project/project.schema").Project> & import("../project/project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
