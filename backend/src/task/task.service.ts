import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.schema';
import { Project } from 'src/project/project.schema';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private readonly taskModel: Model<Task>,
        @InjectModel(Project.name) private readonly projectModel: Model<Project>
    ) { }

    async findByProjectId(project_id: string): Promise<Task[]> {
        const project = await this.projectModel
            .findById(project_id)
            .populate<{ tasks: Task[] }>({
                path: 'tasks',
                model: 'Task'
            });

        if (!project) {
            throw new NotFoundException(`Project with ID ${project_id} not found`);
        }

        return project.tasks;
    }

    async findByProjectIdandTaskId(project_id: string, task_id: string): Promise<Task> {

        const project = await this.projectModel
            .findById(project_id)
            .populate<{ tasks: Task[] }>({
                path: 'tasks',
                model: 'Task'
            });

        if (!project) {
            throw new NotFoundException(`Project with project ID ${project_id}  not found`);
        }
        
        const task = project.tasks.find(task => (task._id as Types.ObjectId).toString() === task_id);

        if (!task) {
            throw new NotFoundException(`Task with ID ${task_id} not found in project ${project_id}`);
        }

        return task;
    }



    async createTask(project_id: string, createTaskDto: CreateTaskDto): Promise<Task> {
        const project = await this.projectModel.findById(project_id);
        const deadlineDate = new Date(createTaskDto.deadline)

        if (isNaN(deadlineDate.getTime())) {
            throw new BadRequestException('Invalid date format');
        }

        if (!project) {
            throw new NotFoundException(`Project with ID ${project_id} not found`);
        }

        const createdTask = new this.taskModel({
            ...createTaskDto,
            deadline: deadlineDate,
        });

        await this.projectModel.findByIdAndUpdate(
            project_id,
            { $push: { tasks: createdTask._id } }
        );
        return createdTask.save();
    }

    async updateTask(project_id: string, task_id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {

        const project = await this.projectModel.findById(project_id);

        if (!project) {
            throw new NotFoundException(`Project with project ID ${project_id}  not found`);
        }

        const task = project.tasks.find(task => (task._id as Types.ObjectId).toString() === task_id);

        if (!task) {
            throw new NotFoundException(`Task with ID ${task_id} not found in project ${project_id}`);
        }

        const updatedTask = await this.taskModel.findByIdAndUpdate(
            task_id,
            { $set: updateTaskDto },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedTask) {
            throw new NotFoundException(`Failed to update: task with ID ${task_id} not found`);
        }

        return updatedTask;
    }
}
