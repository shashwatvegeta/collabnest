"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./task.schema");
const project_schema_1 = require("../project/project.schema");
let TaskService = class TaskService {
    taskModel;
    projectModel;
    constructor(taskModel, projectModel) {
        this.taskModel = taskModel;
        this.projectModel = projectModel;
    }
    async findByProjectId(project_id) {
        const project = await this.projectModel
            .findById(project_id)
            .populate({
            path: 'tasks',
            model: 'Task'
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${project_id} not found`);
        }
        return project.tasks;
    }
    async findByProjectIdandTaskId(project_id, task_id) {
        const project = await this.projectModel
            .findById(project_id)
            .populate({
            path: 'tasks',
            model: 'Task'
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with project ID ${project_id}  not found`);
        }
        const task = project.tasks.find(task => task._id.toString() === task_id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${task_id} not found in project ${project_id}`);
        }
        return task;
    }
    async createTask(project_id, createTaskDto) {
        const project = await this.projectModel.findById(project_id);
        const deadlineDate = new Date(createTaskDto.deadline);
        if (isNaN(deadlineDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${project_id} not found`);
        }
        const createdTask = new this.taskModel({
            ...createTaskDto,
            deadline: deadlineDate,
        });
        await this.projectModel.findByIdAndUpdate(project_id, { $push: { tasks: createdTask._id } });
        return createdTask.save();
    }
    async updateTask(project_id, task_id, updateTaskDto) {
        const project = await this.projectModel.findById(project_id);
        if (!project) {
            throw new common_1.NotFoundException(`Project with project ID ${project_id}  not found`);
        }
        const task = project.tasks.find(task => task._id.toString() === task_id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${task_id} not found in project ${project_id}`);
        }
        const updatedTask = await this.taskModel.findByIdAndUpdate(task_id, { $set: updateTaskDto }, { new: true, runValidators: true }).exec();
        if (!updatedTask) {
            throw new common_1.NotFoundException(`Failed to update: task with ID ${task_id} not found`);
        }
        return updatedTask;
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TaskService);
//# sourceMappingURL=task.service.js.map