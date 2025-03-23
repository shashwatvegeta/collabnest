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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProjectService = class ProjectService {
    projectModel;
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async create(createProjectDto) {
        if (new Date(createProjectDto.start_date) >= new Date(createProjectDto.end_date)) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const startDate = new Date(createProjectDto.start_date);
        startDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
            throw new common_1.BadRequestException('Start date must be today or in the future');
        }
        let approvalStatus = 'pending';
        if (typeof createProjectDto.project_owner === 'object' &&
            createProjectDto.project_owner !== null) {
            if (createProjectDto.project_owner.user_type === 'professor') {
                approvalStatus = 'approved';
            }
        }
        const createdProject = new this.projectModel({
            ...createProjectDto,
            is_approved: approvalStatus,
            is_completed: false,
        });
        return createdProject.save();
    }
    async findAll() {
        return this.projectModel.find().exec();
    }
    async findOne(project_id) {
        const project = await this.projectModel.findOne({ _id: new mongoose_2.Types.ObjectId(project_id) }).exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${project_id} not found`);
        }
        return project;
    }
    update(project_id, updateProjectDto) {
        return this.projectModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(project_id) }, updateProjectDto, { new: true })
            .exec();
    }
    async remove(project_id) {
        const project = await this.projectModel.findOne({ _id: new mongoose_2.Types.ObjectId(project_id) }).exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${project_id} not found`);
        }
        if (project.students_enrolled && project.students_enrolled.length > 0) {
            throw new common_1.BadRequestException('Cannot delete project with enrolled students');
        }
        return this.projectModel.findOneAndDelete({ _id: new mongoose_2.Types.ObjectId(project_id) }).exec();
    }
    async getStudents(project_id) {
        const project = await this.projectModel.findById(project_id).populate({
            path: 'students_enrolled',
            model: 'User',
        }).exec();
        return project ? project.students_enrolled : null;
    }
    async addStudent(project_id, student_id) {
        const project = await this.findOne(project_id);
        if (project.is_completed) {
            throw new common_1.BadRequestException('Cannot join a completed project');
        }
        if (project.students_enrolled && project.students_enrolled.length >= project.cap) {
            throw new common_1.BadRequestException('Project has reached maximum capacity');
        }
        if (Array.isArray(project.students_enrolled) && project.students_enrolled.some(student => student?._id?.toString() === student_id?.toString() || student?.toString() === student_id)) {
            throw new common_1.ConflictException('Student is already enrolled in this project');
        }
        return this.projectModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(project_id) }, { $addToSet: { students_enrolled: student_id } }, { new: true })
            .exec();
    }
    async removeStudent(project_id, student_id) {
        return this.projectModel
            .findByIdAndUpdate(project_id, { $pull: { students_enrolled: student_id } }, { new: true })
            .exec();
    }
    async findByTaskId(task_id) {
        return this.projectModel.findOne({ tasks: task_id }).populate('owner').exec();
    }
    async updateApprovalStatus(id, status) {
        return this.projectModel.findByIdAndUpdate(id, { is_approved: status }, { new: true }).exec();
    }
    async findPendingApprovals() {
        return this.projectModel.find({ is_approved: 'pending' }).exec();
    }
    async findApprovedProjects() {
        return this.projectModel.find({ is_approved: 'approved' }).exec();
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Project')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectService);
//# sourceMappingURL=project.service.js.map