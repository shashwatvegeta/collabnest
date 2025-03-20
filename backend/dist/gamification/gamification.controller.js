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
var GamificationController_1, GamificationBulkController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationBulkController = exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const gamification_service_1 = require("./gamification.service");
const update_level_dto_1 = require("./dto/update-level.dto");
let GamificationController = GamificationController_1 = class GamificationController {
    gamificationService;
    logger = new common_1.Logger(GamificationController_1.name);
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async getUserLevel(userId) {
        this.logger.log(`Fetching level for userId: ${userId}`);
        try {
            const level = await this.gamificationService.getUserLevel(userId);
            this.logger.log(`Found level for userId ${userId}: Level ${level?.level}, XP ${level?.xp}/${level?.nextLevelXp}`);
            return level;
        }
        catch (error) {
            this.logger.error(`Error fetching level for userId ${userId}: ${error.message}`);
            throw error;
        }
    }
    async updateUserLevel(userId, updateLevelDto) {
        this.logger.log(`Updating level for userId: ${userId} with data: ${JSON.stringify(updateLevelDto)}`);
        try {
            const result = await this.gamificationService.updateUserLevel(userId, updateLevelDto);
            this.logger.log(`Updated level for userId ${userId}: Level ${result?.level}, XP ${result?.xp}/${result?.nextLevelXp}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error updating level for userId ${userId}: ${error.message}`);
            throw error;
        }
    }
    async awardXp(userId, body) {
        this.logger.log(`Awarding ${body.xp} XP to userId: ${userId}`);
        try {
            const result = await this.gamificationService.awardXp(userId, body.xp);
            this.logger.log(`Awarded XP for userId ${userId}: Now Level ${result?.level}, XP ${result?.xp}/${result?.nextLevelXp}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error awarding XP to userId ${userId}: ${error.message}`);
            throw error;
        }
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Get)('level'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getUserLevel", null);
__decorate([
    (0, common_1.Put)('level'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_level_dto_1.UpdateLevelDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateUserLevel", null);
__decorate([
    (0, common_1.Post)('award-xp'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "awardXp", null);
exports.GamificationController = GamificationController = GamificationController_1 = __decorate([
    (0, common_1.Controller)('users/:userId/gamification'),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationController);
let GamificationBulkController = GamificationBulkController_1 = class GamificationBulkController {
    gamificationService;
    logger = new common_1.Logger(GamificationBulkController_1.name);
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async awardXpToMultipleUsers(body) {
        this.logger.log(`Bulk awarding ${body.xp} XP to ${body.userIds.length} users: ${body.userIds.join(', ')}`);
        try {
            const results = await this.gamificationService.awardXpToMultipleUsers(body.userIds, body.xp);
            this.logger.log(`Awarded XP to ${results.length} users successfully`);
            return results;
        }
        catch (error) {
            this.logger.error(`Error in bulk XP award: ${error.message}`);
            throw error;
        }
    }
};
exports.GamificationBulkController = GamificationBulkController;
__decorate([
    (0, common_1.Post)('award-xp-bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationBulkController.prototype, "awardXpToMultipleUsers", null);
exports.GamificationBulkController = GamificationBulkController = GamificationBulkController_1 = __decorate([
    (0, common_1.Controller)('gamification'),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationBulkController);
//# sourceMappingURL=gamification.controller.js.map