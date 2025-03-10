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
exports.DiscussionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DiscussionService = class DiscussionService {
    discussionModel;
    constructor(discussionModel) {
        this.discussionModel = discussionModel;
    }
    async findAllPosts(discussion_id) {
        const discussion = await this.discussionModel.findById(discussion_id).exec();
        if (!discussion) {
            throw new common_1.NotFoundException(`Discussion with ID ${discussion_id} not found`);
        }
        return this.discussionModel.find({ discussion_id }).exec();
    }
    async createPost(discussion_id, createDiscussionDto) {
        const discussion = await this.discussionModel.findById(discussion_id).exec();
        if (!discussion) {
            throw new common_1.NotFoundException(`Discussion with ID ${discussion_id} not found`);
        }
        const postData = {
            ...createDiscussionDto,
            discussion_id
        };
        const createdPost = new this.discussionModel(postData);
        const savedPost = await createdPost.save();
        await this.discussionModel.findByIdAndUpdate(discussion_id, { $push: { 'Discussion Replies': savedPost._id } }, { new: true }).exec();
        return savedPost;
    }
    async updatePost(discussion_id, post_id, updateDiscussionDto) {
        const discussion = await this.discussionModel.findById(discussion_id).exec();
        if (!discussion) {
            throw new common_1.NotFoundException(`Discussion with ID ${discussion_id} not found`);
        }
        const post = await this.discussionModel.findById(post_id).exec();
        if (!post) {
            throw new common_1.NotFoundException(`Discussion post with ID ${post_id} not found`);
        }
        if (post.discussion_id.toString() !== discussion_id) {
            throw new common_1.NotFoundException(`Post doesn't belong to the specified discussion`);
        }
        return this.discussionModel.findByIdAndUpdate(post_id, updateDiscussionDto, { new: true }).exec();
    }
    async deletePost(discussion_id, post_id) {
        const discussion = await this.discussionModel.findById(discussion_id).exec();
        if (!discussion) {
            throw new common_1.NotFoundException(`Discussion with ID ${discussion_id} not found`);
        }
        const post = await this.discussionModel.findById(post_id).exec();
        if (!post) {
            throw new common_1.NotFoundException(`Discussion post with ID ${post_id} not found`);
        }
        if (post.discussion_id.toString() !== discussion_id) {
            throw new common_1.NotFoundException(`Post doesn't belong to the specified discussion`);
        }
        const deletedPost = await this.discussionModel.findByIdAndDelete(post_id).exec();
        await this.discussionModel.findByIdAndUpdate(discussion_id, { $pull: { 'Discussion Replies': post_id } }).exec();
        return deletedPost;
    }
};
exports.DiscussionService = DiscussionService;
exports.DiscussionService = DiscussionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Discussion')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DiscussionService);
//# sourceMappingURL=discussion.service.js.map