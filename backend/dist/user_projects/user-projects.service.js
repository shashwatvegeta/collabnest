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
exports.UserProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserProjectsService = class UserProjectsService {
    projectModel;
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async findAllForUser(userId) {
        return this.projectModel.find({ project_owner: userId }).exec();
    }
    async findOneForUser(userId, projectId) {
        return this.projectModel.findOne({
            project_id: projectId,
            project_owner: userId,
        }).exec();
    }
    async createForUser(userId, createProjectDto) {
        const projectData = {
            ...createProjectDto,
            project_owner: userId,
            is_approved: 'pending',
            is_completed: false,
            discussion_threads: [],
            tags: [],
            students_enrolled: [],
            tasks: [],
            project_application: [],
        };
        const createdProject = new this.projectModel(projectData);
        return createdProject.save();
    }
    async updateForUser(userId, projectId, updateProjectDto) {
        return this.projectModel.findOneAndUpdate({ project_id: projectId, project_owner: userId }, updateProjectDto, { new: true }).exec();
    }
    async removeForUser(userId, projectId) {
        return this.projectModel.findOneAndDelete({
            project_id: projectId,
            project_owner: userId,
        }).exec();
    }
};
exports.UserProjectsService = UserProjectsService;
exports.UserProjectsService = UserProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Project')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserProjectsService);
//# sourceMappingURL=user-projects.service.js.map