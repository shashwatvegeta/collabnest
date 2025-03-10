import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.schema';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    getTasks(project_id: string): Promise<Task[]>;
    getTask(project_id: string, task_id: string): Promise<Task>;
    createTask(project_id: string, createTaskDto: CreateTaskDto): Promise<Task>;
    updateTask(project_id: string, task_id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
}
