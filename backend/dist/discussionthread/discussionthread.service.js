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
exports.DiscussionThreadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const discussionthread_entity_1 = require("../discussionthread/entities/discussionthread.entity");
let DiscussionThreadsService = class DiscussionThreadsService {
    discussionThreadModel;
    constructor(discussionThreadModel) {
        this.discussionThreadModel = discussionThreadModel;
    }
    async findAllByProject(projectId) {
        return this.discussionThreadModel.find({
            project_id: new mongoose_2.Types.ObjectId(projectId)
        }).exec();
    }
    async findOne(projectId, discussionId) {
        const thread = await this.discussionThreadModel.findOne({
            project_id: new mongoose_2.Types.ObjectId(projectId),
            _id: new mongoose_2.Types.ObjectId(discussionId)
        }).exec();
        if (!thread) {
            throw new common_1.NotFoundException(`Discussion thread not found`);
        }
        return thread;
    }
    async create(projectId, createDiscussionDto, userId) {
        try {
            const objectIdProjectId = new mongoose_2.Types.ObjectId(projectId);
            const createdBy = new mongoose_2.Types.ObjectId(createDiscussionDto.created_by || userId);
            const discussionId = new mongoose_2.Types.ObjectId();
            return this.discussionThreadModel.create({
                ...createDiscussionDto,
                discussion_id: discussionId,
                project_id: objectIdProjectId,
                created_by: createdBy,
                replies: []
            });
        }
        catch (error) {
            console.error('Error creating discussion thread:', error);
            throw error;
        }
    }
    async update(projectId, discussionId, updateDiscussionDto, userId, isMentor) {
        const discussionThread = await this.findOne(projectId, discussionId);
        let userObjectId;
        try {
            userObjectId = new mongoose_2.Types.ObjectId(userId);
        }
        catch (error) {
            userObjectId = new mongoose_2.Types.ObjectId('000000000000000000000000');
        }
        const updateData = {};
        if (updateDiscussionDto.title) {
            updateData.title = updateDiscussionDto.title;
        }
        if (updateDiscussionDto.description) {
            updateData.description = updateDiscussionDto.description;
        }
        if (updateDiscussionDto.replies) {
            const formattedReplies = updateDiscussionDto.replies.map(reply => ({
                ...reply,
                created_by: new mongoose_2.Types.ObjectId(reply.created_by),
                created_at: reply.created_at || new Date(),
                created_by_username: reply.created_by_username
            }));
            updateData.replies = formattedReplies;
        }
        const updatedThread = await this.discussionThreadModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(discussionId) }, { $set: updateData }, { new: true }).exec();
        if (!updatedThread) {
            throw new common_1.NotFoundException(`Discussion thread not found after update`);
        }
        return updatedThread;
    }
    async remove(projectId, discussionId, userId, isMentor) {
        const discussionThread = await this.findOne(projectId, discussionId);
        await this.discussionThreadModel.deleteOne({ _id: new mongoose_2.Types.ObjectId(discussionId) }).exec();
    }
};
exports.DiscussionThreadsService = DiscussionThreadsService;
exports.DiscussionThreadsService = DiscussionThreadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(discussionthread_entity_1.DiscussionThread.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DiscussionThreadsService);
//# sourceMappingURL=discussionthread.service.js.map