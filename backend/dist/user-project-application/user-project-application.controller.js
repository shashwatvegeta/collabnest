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
exports.UserProjectApplicationController = void 0;
const common_1 = require("@nestjs/common");
const user_project_application_service_1 = require("./user-project-application.service");
const update_application_dto_1 = require("../application/dto/update-application.dto");
let UserProjectApplicationController = class UserProjectApplicationController {
    userProjectApplicationService;
    constructor(userProjectApplicationService) {
        this.userProjectApplicationService = userProjectApplicationService;
    }
    findAll(userId) {
        return this.userProjectApplicationService.findAllForUser(userId);
    }
    findOne(userId, applicationId) {
        return this.userProjectApplicationService.findOneForUser(userId, applicationId);
    }
    update(userId, projectId, applicationId, updateApplicationDto) {
        return this.userProjectApplicationService.updateApplicationStatus(userId, projectId, applicationId, updateApplicationDto);
    }
};
exports.UserProjectApplicationController = UserProjectApplicationController;
__decorate([
    (0, common_1.Get)('project-applications'),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserProjectApplicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('project-applications/:application_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('application_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserProjectApplicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('projects/:pid/project-applications/:application_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('pid')),
    __param(2, (0, common_1.Param)('application_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_application_dto_1.UpdateApplicationDto]),
    __metadata("design:returntype", void 0)
], UserProjectApplicationController.prototype, "update", null);
exports.UserProjectApplicationController = UserProjectApplicationController = __decorate([
    (0, common_1.Controller)('users/:user_id'),
    __metadata("design:paramtypes", [user_project_application_service_1.UserProjectApplicationService])
], UserProjectApplicationController);
//# sourceMappingURL=user-project-application.controller.js.map