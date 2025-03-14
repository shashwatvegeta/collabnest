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
exports.DiscussionThreadsController = void 0;
const common_1 = require("@nestjs/common");
const discussionthread_service_1 = require("../discussionthread/discussionthread.service");
const create_discussionthread_dto_1 = require("../discussionthread/dto/create-discussionthread.dto");
const update_discussionthread_dto_1 = require("../discussionthread/dto/update-discussionthread.dto");
let DiscussionThreadsController = class DiscussionThreadsController {
    discussionThreadsService;
    constructor(discussionThreadsService) {
        this.discussionThreadsService = discussionThreadsService;
    }
    findAll(projectId) {
        return this.discussionThreadsService.findAllByProject(projectId);
    }
    findOne(projectId, discussionId) {
        return this.discussionThreadsService.findOne(projectId, discussionId);
    }
    create(projectId, createDiscussionDto, req) {
        return this.discussionThreadsService.create(projectId, createDiscussionDto, req.user?.id || 'anonymous');
    }
    update(projectId, discussionId, updateDiscussionDto, req) {
        const isMentor = req.user?.isMentor || req.user?.isProfessor || false;
        return this.discussionThreadsService.update(projectId, discussionId, updateDiscussionDto, req.user?.id || 'anonymous', isMentor);
    }
    remove(projectId, discussionId, req) {
        const isMentor = req.user?.isMentor || req.user?.isProfessor || false;
        return this.discussionThreadsService.remove(projectId, discussionId, req.user?.id || 'anonymous', isMentor);
    }
};
exports.DiscussionThreadsController = DiscussionThreadsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscussionThreadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':disc_id'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('disc_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DiscussionThreadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_discussionthread_dto_1.CreateDiscussionthreadDto, Object]),
    __metadata("design:returntype", Promise)
], DiscussionThreadsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':disc_id'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('disc_id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_discussionthread_dto_1.UpdateDiscussionthreadDto, Object]),
    __metadata("design:returntype", Promise)
], DiscussionThreadsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':disc_id'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('disc_id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DiscussionThreadsController.prototype, "remove", null);
exports.DiscussionThreadsController = DiscussionThreadsController = __decorate([
    (0, common_1.Controller)('projects/:projectId/discussion'),
    __metadata("design:paramtypes", [discussionthread_service_1.DiscussionThreadsService])
], DiscussionThreadsController);
//# sourceMappingURL=discussionthread.controller.js.map