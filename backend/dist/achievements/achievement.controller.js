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
exports.AchievementController = void 0;
const common_1 = require("@nestjs/common");
const achievement_service_1 = require("./achievement.service");
const create_achievement_dto_1 = require("./dto/create-achievement.dto");
const update_achievement_dto_1 = require("./dto/update-achievement.dto");
let AchievementController = class AchievementController {
    achievementService;
    constructor(achievementService) {
        this.achievementService = achievementService;
    }
    create(user_id, createAchievementDto) {
        return this.achievementService.create(user_id, createAchievementDto);
    }
    findAll(user_id) {
        return this.achievementService.findAll(user_id);
    }
    findOne(user_id, achievement_id) {
        return this.achievementService.findOne(user_id, achievement_id);
    }
    update(user_id, achievement_id, updateAchievementDto) {
        return this.achievementService.update(user_id, achievement_id, updateAchievementDto);
    }
    remove(user_id, achievement_id) {
        return this.achievementService.remove(user_id, achievement_id);
    }
};
exports.AchievementController = AchievementController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_achievement_dto_1.CreateAchievementDto]),
    __metadata("design:returntype", void 0)
], AchievementController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AchievementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':achievement_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('achievement_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AchievementController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':achievement_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('achievement_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_achievement_dto_1.UpdateAchievementDto]),
    __metadata("design:returntype", void 0)
], AchievementController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':achievement_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('achievement_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AchievementController.prototype, "remove", null);
exports.AchievementController = AchievementController = __decorate([
    (0, common_1.Controller)('users/:user_id/achievements'),
    __metadata("design:paramtypes", [achievement_service_1.AchievementService])
], AchievementController);
//# sourceMappingURL=achievement.controller.js.map