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
exports.UserProjectsController = void 0;
const common_1 = require("@nestjs/common");
const user_projects_service_1 = require("./user-projects.service");
const create_project_dto_1 = require("../project/dto/create-project.dto");
const update_project_dto_1 = require("../project/dto/update-project.dto");
const project_guard_1 = require("../guard/project.guard");
const project_owner_guard_1 = require("../guard/project-owner.guard");
let UserProjectsController = class UserProjectsController {
    userProjectsService;
    constructor(userProjectsService) {
        this.userProjectsService = userProjectsService;
    }
    findAll(userId) {
        return this.userProjectsService.findAllForUser(userId);
    }
    findOne(userId, projectId) {
        return this.userProjectsService.findOneForUser(userId, +projectId);
    }
    create(userId, createProjectDto) {
        return this.userProjectsService.createForUser(userId, createProjectDto);
    }
    remove(userId, projectId) {
        return this.userProjectsService.removeForUser(userId, +projectId);
    }
    update(userId, projectId, updateProjectDto) {
        return this.userProjectsService.updateForUser(userId, +projectId, updateProjectDto);
    }
};
exports.UserProjectsController = UserProjectsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':project_id'),
    (0, common_1.UseGuards)(project_guard_1.ProjectGuard),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('project_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], UserProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':pid'),
    (0, common_1.UseGuards)(project_owner_guard_1.ProjectOwnerGuard),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('pid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':pid'),
    (0, common_1.UseGuards)(project_owner_guard_1.ProjectOwnerGuard),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('pid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], UserProjectsController.prototype, "update", null);
exports.UserProjectsController = UserProjectsController = __decorate([
    (0, common_1.Controller)('users/:user_id/projects'),
    __metadata("design:paramtypes", [user_projects_service_1.UserProjectsService])
], UserProjectsController);
//# sourceMappingURL=user-projects.controller.js.map