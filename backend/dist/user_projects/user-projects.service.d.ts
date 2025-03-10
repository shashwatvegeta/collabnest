import { Model } from 'mongoose';
import { Project } from '../project/project.schema';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { UpdateProjectDto } from '../project/dto/update-project.dto';
export declare class UserProjectsService {
    private projectModel;
    constructor(projectModel: Model<Project>);
    findAllForUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOneForUser(userId: string, projectId: number): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    createForUser(userId: string, createProjectDto: CreateProjectDto): Promise<import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateForUser(userId: string, projectId: number, updateProjectDto: UpdateProjectDto): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeForUser(userId: string, projectId: number): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
