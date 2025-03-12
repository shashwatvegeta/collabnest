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
exports.SkillVerificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const skill_schema_1 = require("./schemas/skill.schema");
const user_skill_schema_1 = require("./schemas/user-skill.schema");
let SkillVerificationService = class SkillVerificationService {
    skillModel;
    userSkillModel;
    constructor(skillModel, userSkillModel) {
        this.skillModel = skillModel;
        this.userSkillModel = userSkillModel;
    }
    async addSkill(createSkillDto) {
        const newSkill = new this.skillModel(createSkillDto);
        return newSkill.save();
    }
    async getAllSkills() {
        return this.skillModel.find().exec();
    }
    async verifySkill(verifySkillDto) {
        return this.userSkillModel.create(verifySkillDto);
    }
    async getUserSkillStatus(userId) {
        return this.userSkillModel.find({ userId }).exec();
    }
    async verifyUserSkill(userId, skillId) {
        return this.userSkillModel.create({ userId, skillId, verified: true });
    }
    async getVerifiedSkills(userId) {
        return this.userSkillModel.find({ userId, verified: true }).exec();
    }
};
exports.SkillVerificationService = SkillVerificationService;
exports.SkillVerificationService = SkillVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(skill_schema_1.Skill.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_skill_schema_1.UserSkill.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SkillVerificationService);
//# sourceMappingURL=skill-verification.service.js.map