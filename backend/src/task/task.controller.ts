import { Controller, Get, Post, Put, Param, Body, NotFoundException, ValidationPipe, UsePipes, BadRequestException, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.schema';
import { Types } from 'mongoose';

@Controller('projects/:project_id/tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get()
    async getTasks(@Param('project_id') project_id: string): Promise<Task[]> {

        if (!Types.ObjectId.isValid(project_id)) {
            throw new BadRequestException('Invalid project_id');
        }

        return this.taskService.findByProjectId(project_id);
    }

    @Get(':task_id')
    async getTask(@Param('project_id') project_id: string, @Param('task_id') task_id: string): Promise<Task> {
        if (!Types.ObjectId.isValid(project_id) || !Types.ObjectId.isValid(task_id)) {
            throw new BadRequestException('Invalid project_id or task_id');
        }
        
        return this.taskService.findByProjectIdandTaskId(project_id, task_id);
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async createTask(@Param('project_id') project_id: string, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
        if (!Types.ObjectId.isValid(project_id)) {
            throw new BadRequestException('Invalid project_id');
        }

        return this.taskService.createTask(project_id, createTaskDto);
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Put(':task_id')
    async updateTask(
        @Param('project_id') project_id: string,
        @Param('task_id') task_id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ): Promise<Task> {
        // professor and mentor can change task specific details
        if(!updateTaskDto) {
            throw new BadRequestException( "Dto cannot be empty." );
        }
        
        return this.taskService.updateTask(project_id, task_id, updateTaskDto);
    }
}