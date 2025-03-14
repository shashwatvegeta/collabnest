import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.schema';
import { Model } from 'mongoose';
export declare class ProjectService {
    private projectModel;
    constructor(projectModel: Model<Project>);
    create(createProjectDto: CreateProjectDto): Promise<import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: number): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(id: number): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    getStudents(projectId: number): Promise<Object[] | null>;
    addStudent(projectId: number, studentId: string): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeStudent(projectId: number, studentId: string): Promise<(import("mongoose").Document<unknown, {}, Project> & Project & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
