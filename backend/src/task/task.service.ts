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

        const task = await this.taskModel.findOne({
            _id: task_id,
            project_id: new Types.ObjectId(project_id)
        });

        if (!task) {
            throw new NotFoundException(`task with project ID ${project_id} and task ID ${task_id} not found`);
        }

        return task;
    }



    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const project = await this.projectModel.findById(createTaskDto.project_id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${createTaskDto.project_id} not found`);
        }
        const createdTask = new this.taskModel(createTaskDto);
        await this.projectModel.findByIdAndUpdate(
            createTaskDto.project_id,
            { $push: { tasks: createdTask._id } }
        );
        return createdTask.save();
    }

    async updateTask(project_id: string, task_id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {

        const task = await this.taskModel.findOne({
            _id: task_id,
            project_id: new Types.ObjectId(project_id)
        });

        if (!task) {
            throw new NotFoundException(`task with project ID ${project_id} and task ID ${task_id} not found`);
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
