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
exports.DiscussionPostController = void 0;
const common_1 = require("@nestjs/common");
const discussion_service_1 = require("./discussion.service");
const create_discussion_dto_1 = require("./dto/create-discussion.dto");
const update_discussion_dto_1 = require("./dto/update-discussion.dto");
const mongoose_1 = require("mongoose");
class ValidateObjectId {
    transform(value) {
        const isValid = mongoose_1.Types.ObjectId.isValid(value);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid ObjectId');
        }
        return value;
    }
}
let DiscussionPostController = class DiscussionPostController {
    discussionService;
    constructor(discussionService) {
        this.discussionService = discussionService;
    }
    findAllPosts(discussion_id) {
        return this.discussionService.findAllPosts(discussion_id);
    }
    createPost(discussion_id, createDiscussionDto) {
        return this.discussionService.createPost(discussion_id, createDiscussionDto);
    }
    updatePost(discussion_id, post_id, updateDiscussionDto) {
        return this.discussionService.updatePost(discussion_id, post_id, updateDiscussionDto);
    }
    deletePost(discussion_id, post_id) {
        return this.discussionService.deletePost(discussion_id, post_id);
    }
};
exports.DiscussionPostController = DiscussionPostController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('discussion_id', ValidateObjectId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscussionPostController.prototype, "findAllPosts", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('discussion_id', ValidateObjectId)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_discussion_dto_1.CreateDiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionPostController.prototype, "createPost", null);
__decorate([
    (0, common_1.Put)(':post_id'),
    __param(0, (0, common_1.Param)('discussion_id', ValidateObjectId)),
    __param(1, (0, common_1.Param)('post_id', ValidateObjectId)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_discussion_dto_1.UpdateDiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionPostController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(':post_id'),
    __param(0, (0, common_1.Param)('discussion_id', ValidateObjectId)),
    __param(1, (0, common_1.Param)('post_id', ValidateObjectId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DiscussionPostController.prototype, "deletePost", null);
exports.DiscussionPostController = DiscussionPostController = __decorate([
    (0, common_1.Controller)('discussions/:discussion_id/discussion_post'),
    __metadata("design:paramtypes", [discussion_service_1.DiscussionService])
], DiscussionPostController);
//# sourceMappingURL=discussion.controller.js.map