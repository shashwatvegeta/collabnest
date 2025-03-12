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
exports.SkillVerificationController = void 0;
const common_1 = require("@nestjs/common");
const skill_verification_service_1 = require("./skill-verification.service");
const skill_dto_1 = require("./dto/skill.dto");
let SkillVerificationController = class SkillVerificationController {
    skillService;
    constructor(skillService) {
        this.skillService = skillService;
    }
    async addSkill(createSkillDto) {
        return this.skillService.addSkill(createSkillDto);
    }
    async getAllSkills() {
        return this.skillService.getAllSkills();
    }
    async verifySkill(verifySkillDto) {
        return this.skillService.verifySkill(verifySkillDto);
    }
    async getUserSkillStatus(userId) {
        return this.skillService.getUserSkillStatus(userId);
    }
    async verifyUserSkill(userId, skillId) {
        return this.skillService.verifyUserSkill(userId, skillId);
    }
    async getVerifiedSkills(userId) {
        return this.skillService.getVerifiedSkills(userId);
    }
};
exports.SkillVerificationController = SkillVerificationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [skill_dto_1.CreateSkillDto]),
    __metadata("design:returntype", Promise)
], SkillVerificationController.prototype, "addSkill", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkillVerificationController.prototype, "getAllSkills", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [skill_dto_1.VerifySkillDto]),
    __metadata("design:returntype", Promise)
], SkillVerificationController.prototype, "verifySkill", null);
__decorate([
    (0, common_1.Get)('status/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillVerificationController.prototype, "getUserSkillStatus", null);
__decorate([
    (0, common_1.Post)('/users/:userId/skills/:skillId/verify'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('skillId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SkillVerificationController.prototype, "verifyUserSkill", null);
__decorate([
    (0, common_1.Get)('/users/:userId/skills'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillVerificationController.prototype, "getVerifiedSkills", null);
exports.SkillVerificationController = SkillVerificationController = __decorate([
    (0, common_1.Controller)('skills'),
    __metadata("design:paramtypes", [skill_verification_service_1.SkillVerificationService])
], SkillVerificationController);
//# sourceMappingURL=skill-verification.controller.js.map