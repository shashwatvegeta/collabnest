import { Controller, Get, Post, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.schema';

@Controller('projects/:project_id/tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get()
    async getTasks(@Param('project_id') project_id: string): Promise<Task[]> {
        return this.taskService.findByProjectId(project_id);
    }

    @Get(':task_id')
    async getTask(@Param('project_id') project_id: string, @Param('task_id') task_id: string): Promise<Task> {
        return this.taskService.findByProjectIdandTaskId(project_id, task_id);
    }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }

    @Put(':task_id')
    async updateTask(
        @Param('project_id') project_id: string,
        @Param('task_id') task_id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ): Promise<Task> {
        return this.taskService.updateTask(project_id, task_id, updateTaskDto);
    }
}