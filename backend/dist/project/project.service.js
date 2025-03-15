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
    create(createProjectDto) {
        const createdProject = new this.projectModel(createProjectDto);
        return createdProject.save();
    }
    findAll() {
        return this.projectModel.find().exec();
    }
    findOne(id) {
        return this.projectModel.findOne({ project_id: id }).exec();
    }
    update(id, updateProjectDto) {
        return this.projectModel
            .findOneAndUpdate({ project_id: id }, updateProjectDto, { new: true })
            .exec();
    }
    remove(id) {
        return this.projectModel.findOneAndDelete({ project_id: id }).exec();
    }
    async getStudents(projectId) {
        const project = await this.projectModel.findOne({ project_id: projectId }).exec();
        return project ? project.students_enrolled : null;
    }
    async addStudent(projectId, studentId) {
        return this.projectModel
            .findOneAndUpdate({ project_id: projectId }, { $addToSet: { students_enrolled: studentId } }, { new: true })
            .exec();
    }
    async removeStudent(projectId, studentId) {
        return this.projectModel
            .findOneAndUpdate({ project_id: projectId }, { $pull: { students_enrolled: studentId } }, { new: true })
            .exec();
    }
    async findByTaskId(task_id) {
        return this.projectModel.findOne({ tasks: task_id }).populate('owner').exec();
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Project')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectService);
//# sourceMappingURL=project.service.js.map