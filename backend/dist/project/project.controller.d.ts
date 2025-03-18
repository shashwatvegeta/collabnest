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
    findPendingApprovals(): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findApprovedProjects(): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(project_id: string): Promise<import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(project_id: string, updateProjectDto: UpdateProjectDto): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    approveProject(project_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    rejectProject(project_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(project_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    getStudents(project_id: string): Promise<import("mongoose").Types.ObjectId[] | null>;
    addStudent(project_id: string, student_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeStudent(project_id: string, student_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./project.schema").Project> & import("./project.schema").Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
