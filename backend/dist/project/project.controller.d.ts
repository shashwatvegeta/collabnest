import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto): Promise<import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
