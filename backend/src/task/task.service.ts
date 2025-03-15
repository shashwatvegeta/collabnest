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

        const currentDate = new Date();
        const projectEndDate = new Date(project.end_date);
        if (deadlineDate < currentDate || deadlineDate > projectEndDate) {
            throw new BadRequestException('Deadline has already passed');
        }

        await this.projectModel.findByIdAndUpdate(
            project_id,
            { $push: { tasks: createdTask._id } }
        );
        return createdTask.save();
    }

    async updateTask(
        project_id: string,
        task_id: string,
        updateTaskDto: UpdateTaskDto
    ): Promise<Task> {
        // Check if project exists
        const project = await this.projectModel.findById(project_id);
        if (!project) {
            throw new NotFoundException(`Project with project ID ${project_id} not found`);
        }

        // Check if task exists within project
        const task = project.tasks.find(task => (task._id as Types.ObjectId).toString() === task_id);
        if (!task) {
            throw new NotFoundException(`Task with ID ${task_id} not found in project ${project_id}`);
        }

        // Convert assigned_to string IDs to ObjectIds
        if (updateTaskDto.assigned_to) {
            updateTaskDto.assigned_to = updateTaskDto.assigned_to.map(id => new Types.ObjectId(id));
        }

        // Prepare update object
        const updateFields: any = { ...updateTaskDto }; // Copy all fields

        // Handle assigned_to updates separately
        if (updateTaskDto.assigned_to) {
            if (updateTaskDto.action === 'add') {
                updateFields.$addToSet = { assigned_to: { $each: updateTaskDto.assigned_to } };
            } else if (updateTaskDto.action === 'remove') {
                updateFields.$pull = { assigned_to: { $in: updateTaskDto.assigned_to } };
            }
            // Prevent overriding assigned_to if action is specified
            delete updateFields.assigned_to;
            delete updateFields.action;
        }

        // Update the task
        const updatedTask = await this.taskModel.findByIdAndUpdate(
            task_id,
            updateFields,
            { new: true, runValidators: true }
        ).exec();

        if (!updatedTask) {
            throw new NotFoundException(`Failed to update: task with ID ${task_id} not found`);
        }

        return updatedTask;
    }

    async findOne(task_id: string) { //used in submission guard
        return this.taskModel.findById(task_id).populate('submissions').exec();
    }    
}
