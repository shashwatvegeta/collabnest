import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.schema';
import { Project } from 'src/project/project.schema';
export declare class TaskService {
    private readonly taskModel;
    private readonly projectModel;
    constructor(taskModel: Model<Task>, projectModel: Model<Project>);
    findByProjectId(project_id: string): Promise<Task[]>;
    findByProjectIdandTaskId(project_id: string, task_id: string): Promise<Task>;
    createTask(project_id: string, createTaskDto: CreateTaskDto): Promise<Task>;
    updateTask(project_id: string, task_id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
}
