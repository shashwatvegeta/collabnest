"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillVerificationModule = void 0;
const common_1 = require("@nestjs/common");
const skill_verification_controller_1 = require("./skill-verification.controller");
const skill_verification_service_1 = require("./skill-verification.service");
const mongoose_1 = require("@nestjs/mongoose");
const skill_schema_1 = require("./schemas/skill.schema");
const user_skill_schema_1 = require("./schemas/user-skill.schema");
let SkillVerificationModule = class SkillVerificationModule {
};
exports.SkillVerificationModule = SkillVerificationModule;
exports.SkillVerificationModule = SkillVerificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: skill_schema_1.Skill.name, schema: skill_schema_1.SkillSchema },
                { name: user_skill_schema_1.UserSkill.name, schema: user_skill_schema_1.UserSkillSchema },
            ]),
        ],
        controllers: [skill_verification_controller_1.SkillVerificationController],
        providers: [skill_verification_service_1.SkillVerificationService],
    })
], SkillVerificationModule);
//# sourceMappingURL=skill-verification.module.js.map