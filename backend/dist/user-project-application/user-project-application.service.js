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
exports.UserProjectApplicationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserProjectApplicationService = class UserProjectApplicationService {
    applicationModel;
    projectModel;
    constructor(applicationModel, projectModel) {
        this.applicationModel = applicationModel;
        this.projectModel = projectModel;
    }
    async findAllForUser(userId) {
        return this.applicationModel.find({ applicant: userId }).exec();
    }
    async findOneForUser(userId, applicationId) {
        return this.applicationModel.findOne({
            _id: applicationId,
            applicant: userId
        }).exec();
    }
    async updateApplicationStatus(userId, projectId, applicationId, updateApplicationDto) {
        const project = await this.projectModel.findOne({
            project_id: projectId,
            project_owner: userId,
        }).exec();
        if (!project) {
            throw new common_1.ForbiddenException('You do not have permission to manage applications for this project');
        }
        const application = await this.applicationModel.findById(applicationId).exec();
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        const projectId1 = project._id?.toString();
        const projectId2 = application.project?.toString();
        if (!projectId1 || !projectId2 || projectId1 !== projectId2) {
            throw new common_1.ForbiddenException('Application does not belong to this project');
        }
        return this.applicationModel.findByIdAndUpdate(applicationId, updateApplicationDto, { new: true }).exec();
    }
};
exports.UserProjectApplicationService = UserProjectApplicationService;
exports.UserProjectApplicationService = UserProjectApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Application')),
    __param(1, (0, mongoose_1.InjectModel)('Project')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UserProjectApplicationService);
//# sourceMappingURL=user-project-application.service.js.map