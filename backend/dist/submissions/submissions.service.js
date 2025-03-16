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
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SubmissionsService = class SubmissionsService {
    submissionModel;
    taskModel;
    constructor(submissionModel, taskModel) {
        this.submissionModel = submissionModel;
        this.taskModel = taskModel;
    }
    async create(createSubmissionDto, taskId) {
        const task = await this.taskModel.findById(taskId);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (new Date(Date.now()) > new Date(task.deadline)) {
            throw new Error('Submission date cannot be after the task deadline');
        }
        const createdSubmission = new this.submissionModel(createSubmissionDto);
        const savedSubmission = await createdSubmission.save();
        await this.taskModel.findByIdAndUpdate(taskId, {
            $push: { submissions: savedSubmission._id }
        });
        return savedSubmission;
    }
    async findAll(task_id) {
        const taskWithSubmissions = await this.taskModel.findById(task_id).populate({
            path: 'submissions',
            model: 'Submission',
            populate: [{
                    path: 'user_id',
                    model: 'User'
                }]
        }).exec();
        if (!taskWithSubmissions) {
            throw new common_1.NotFoundException('Task not found');
        }
        return taskWithSubmissions.submissions;
    }
    async findOne(task_id, submission_id) {
        const submission = await this.submissionModel
            .findOne({ _id: submission_id })
            .populate('user_id feedback')
            .exec();
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        const task = await this.taskModel.findById(task_id);
        if (!task || !task.submissions.includes(new mongoose_2.Types.ObjectId(submission_id))) {
            throw new common_1.NotFoundException('Submission does not belong to the provided task');
        }
        return submission;
    }
    async remove(task_id, submission_id) {
        const submission = await this.submissionModel.findById(submission_id);
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        const task = await this.taskModel.findById(task_id);
        if (!task || !task.submissions.includes(new mongoose_2.Types.ObjectId(submission_id))) {
            throw new common_1.NotFoundException('Submission does not belong to the provided task');
        }
        await this.taskModel.findByIdAndUpdate(task_id, {
            $pull: { submissions: submission_id }
        });
        return this.submissionModel.findByIdAndDelete(submission_id);
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Submission')),
    __param(1, (0, mongoose_1.InjectModel)('Task')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map