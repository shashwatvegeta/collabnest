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
exports.DiscussionController = void 0;
const common_1 = require("@nestjs/common");
const discussion_service_1 = require("./discussion.service");
const create_discussion_dto_1 = require("./dto/create-discussion.dto");
const update_discussion_dto_1 = require("./dto/update-discussion.dto");
let DiscussionController = class DiscussionController {
    discussionService;
    constructor(discussionService) {
        this.discussionService = discussionService;
    }
    create(createDiscussionDto) {
        return this.discussionService.create(createDiscussionDto);
    }
    findAll() {
        return this.discussionService.findAll();
    }
    findOne(id) {
        return this.discussionService.findOne(+id);
    }
    update(id, updateDiscussionDto) {
        return this.discussionService.update(+id, updateDiscussionDto);
    }
    remove(id) {
        return this.discussionService.remove(+id);
    }
};
exports.DiscussionController = DiscussionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_discussion_dto_1.CreateDiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscussionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscussionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_discussion_dto_1.UpdateDiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscussionController.prototype, "remove", null);
exports.DiscussionController = DiscussionController = __decorate([
    (0, common_1.Controller)('discussion'),
    __metadata("design:paramtypes", [discussion_service_1.DiscussionService])
], DiscussionController);
//# sourceMappingURL=discussion.controller.js.map