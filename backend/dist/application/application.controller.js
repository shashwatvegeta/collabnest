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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const application_service_1 = require("./application.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
let ApplicationsController = class ApplicationsController {
    applicationsService;
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    async createApplication(project_id, createApplicationDto) {
        if (!mongoose_1.Types.ObjectId.isValid(project_id)) {
            throw new common_1.BadRequestException('Invalid project_id');
        }
        createApplicationDto.project_id = new mongoose_1.Types.ObjectId(project_id);
        return this.applicationsService.create(createApplicationDto);
    }
    getApplications(project_id) {
        if (!mongoose_1.Types.ObjectId.isValid(project_id)) {
            throw new common_1.BadRequestException('Invalid project_id');
        }
        return this.applicationsService.findAll(project_id);
    }
    getApplication(project_id, application_id) {
        if (!mongoose_1.Types.ObjectId.isValid(project_id) || !mongoose_1.Types.ObjectId.isValid(application_id)) {
            throw new common_1.BadRequestException('Invalid project_id or application_id');
        }
        return this.applicationsService.findApplication(project_id, application_id);
    }
    updateApplication(project_id, application_id, updateApplicationDto) {
        if (!updateApplicationDto) {
            throw new common_1.BadRequestException("Dto cannot be empty.");
        }
        if ((updateApplicationDto.approval_notes && updateApplicationDto.rejection_reason) ||
            (!updateApplicationDto.approval_notes && !updateApplicationDto.rejection_reason)) {
            throw new common_1.BadRequestException("Either 'approval_notes' or 'rejection_reason' should be provided, but not both.");
        }
        updateApplicationDto.status = (updateApplicationDto.approval_notes) ? "approved" : "rejected";
        console.log(updateApplicationDto);
        return this.applicationsService.updateApplication(project_id, application_id, updateApplicationDto);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.Post)('/:project_id/apply'),
    __param(0, (0, common_1.Param)('project_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "createApplication", null);
__decorate([
    (0, common_1.Get)('/:project_id/applications'),
    __param(0, (0, common_1.Param)('project_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Get)('/:project_id/applications/:application_id'),
    __param(0, (0, common_1.Param)('project_id')),
    __param(1, (0, common_1.Param)('application_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getApplication", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.Put)('/:project_id/applications/:application_id'),
    __param(0, (0, common_1.Param)('project_id')),
    __param(1, (0, common_1.Param)('application_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_application_dto_1.UpdateApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "updateApplication", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [application_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=application.controller.js.map