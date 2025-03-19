import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.schema';
import { Project } from 'src/project/project.schema';
import { GamificationService } from '../gamification/gamification.service';
export declare class TaskService {
    private readonly taskModel;
    private readonly projectModel;
    private readonly gamificationService;
    constructor(taskModel: Model<Task>, projectModel: Model<Project>, gamificationService: GamificationService);
    findByProjectId(project_id: string): Promise<Task[]>;
    findByProjectIdandTaskId(project_id: string, task_id: string): Promise<Task>;
    createTask(project_id: string, createTaskDto: CreateTaskDto): Promise<Task>;
    updateTask(project_id: string, task_id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    findOne(task_id: string): Promise<(import("mongoose").Document<unknown, {}, Task> & Task & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    addMeetingToTask(task_id: string, meeting_id: string): Promise<(import("mongoose").Document<unknown, {}, Task> & Task & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
