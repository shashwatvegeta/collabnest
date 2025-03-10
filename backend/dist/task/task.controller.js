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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const mongoose_1 = require("mongoose");
let TaskController = class TaskController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async getTasks(project_id) {
        if (!mongoose_1.Types.ObjectId.isValid(project_id)) {
            throw new common_1.BadRequestException('Invalid project_id');
        }
        return this.taskService.findByProjectId(project_id);
    }
    async getTask(project_id, task_id) {
        if (!mongoose_1.Types.ObjectId.isValid(project_id) || !mongoose_1.Types.ObjectId.isValid(task_id)) {
            throw new common_1.BadRequestException('Invalid project_id or task_id');
        }
        return this.taskService.findByProjectIdandTaskId(project_id, task_id);
    }
    async createTask(project_id, createTaskDto) {
        if (!mongoose_1.Types.ObjectId.isValid(project_id)) {
            throw new common_1.BadRequestException('Invalid project_id');
        }
        return this.taskService.createTask(project_id, createTaskDto);
    }
    async updateTask(project_id, task_id, updateTaskDto) {
        if (!updateTaskDto) {
            throw new common_1.BadRequestException("Dto cannot be empty.");
        }
        return this.taskService.updateTask(project_id, task_id, updateTaskDto);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('project_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Get)(':task_id'),
    __param(0, (0, common_1.Param)('project_id')),
    __param(1, (0, common_1.Param)('task_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTask", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('project_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.Put)(':task_id'),
    __param(0, (0, common_1.Param)('project_id')),
    __param(1, (0, common_1.Param)('task_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('projects/:project_id/tasks'),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
//# sourceMappingURL=task.controller.js.map