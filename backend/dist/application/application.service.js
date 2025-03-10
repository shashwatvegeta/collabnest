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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("../project/project.schema");
const application_schema_1 = require("./application.schema");
let ApplicationsService = class ApplicationsService {
    applicationModel;
    projectModel;
    constructor(applicationModel, projectModel) {
        this.applicationModel = applicationModel;
        this.projectModel = projectModel;
    }
    async create(createApplicationDto) {
        const project = await this.projectModel.findById(createApplicationDto.project_id);
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${createApplicationDto.project_id} not found`);
        }
        const createdApplication = new this.applicationModel(createApplicationDto);
        await this.projectModel.findByIdAndUpdate(createApplicationDto.project_id, { $push: { project_applications: createdApplication._id } });
        return createdApplication.save();
    }
    async findAll(project_id) {
        const project = await this.projectModel
            .findById(project_id)
            .populate({
            path: 'project_applications',
            model: 'Application'
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${project_id} not found`);
        }
        return project.project_applications;
    }
    async findApplication(project_id, application_id) {
        const application = await this.applicationModel
            .findOne({ _id: application_id, project_id: new mongoose_2.Types.ObjectId(project_id) });
        if (!application) {
            throw new common_1.NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
        }
        return application;
    }
    async updateApplication(project_id, application_id, updateApplicationDto) {
        const application = await this.applicationModel.findOne({
            _id: application_id,
            project_id: new mongoose_2.Types.ObjectId(project_id)
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
        }
        if (application.review_date) {
            throw new common_1.BadRequestException(`Application has already been reviewed on ${application.review_date}`);
        }
        const updatedApplication = await this.applicationModel.findByIdAndUpdate(application_id, { $set: updateApplicationDto }, { new: true, runValidators: true }).exec();
        if (!updatedApplication) {
            throw new common_1.NotFoundException(`Failed to update: Application with ID ${application_id} not found`);
        }
        return updatedApplication;
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ApplicationsService);
//# sourceMappingURL=application.service.js.map