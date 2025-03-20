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
var GamificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_level_schema_1 = require("./schemas/user-level.schema");
let GamificationService = GamificationService_1 = class GamificationService {
    userLevelModel;
    logger = new common_1.Logger(GamificationService_1.name);
    constructor(userLevelModel) {
        this.userLevelModel = userLevelModel;
    }
    async getUserLevel(userId) {
        try {
            this.logger.log(`Getting user level for user: ${userId}`);
            let userLevel = await this.userLevelModel.findOne({ userId }).exec();
            if (!userLevel) {
                this.logger.log(`Creating new user level for user: ${userId}`);
                userLevel = await this.userLevelModel.create({
                    userId,
                    level: 1,
                    xp: 0,
                    nextLevelXp: 600
                });
            }
            if (userLevel && !userLevel.nextLevelXp) {
                this.logger.log(`Adding missing nextLevelXp for user: ${userId}`);
                userLevel = await this.userLevelModel.findOneAndUpdate({ userId }, { $set: { nextLevelXp: 600 } }, { new: true }).exec();
            }
            if (!userLevel) {
                throw new Error(`Failed to create or retrieve user level for user: ${userId}`);
            }
            return userLevel;
        }
        catch (error) {
            this.logger.error(`Error getting user level: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateUserLevel(userId, updateLevelDto) {
        try {
            this.logger.log(`Updating user level for user: ${userId}`);
            const result = await this.userLevelModel.findOneAndUpdate({ userId }, { $set: updateLevelDto }, { new: true, upsert: true }).exec();
            if (!result) {
                throw new Error(`Failed to update user level for user: ${userId}`);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error updating user level: ${error.message}`, error.stack);
            throw error;
        }
    }
    async awardXp(userId, xpAmount) {
        try {
            this.logger.log(`Awarding ${xpAmount} XP to user: ${userId}`);
            const userLevel = await this.getUserLevel(userId);
            if (!userLevel) {
                throw new Error(`Could not find or create user level for user: ${userId}`);
            }
            let newXp = userLevel.xp + xpAmount;
            let newLevel = userLevel.level;
            let newNextLevelXp = userLevel.nextLevelXp || 600;
            while (newXp >= newNextLevelXp) {
                newLevel += 1;
                newXp -= newNextLevelXp;
                newNextLevelXp = 600;
                this.logger.log(`User ${userId} leveled up to level ${newLevel}`);
            }
            this.logger.log(`Updating user ${userId} to level ${newLevel}, XP: ${newXp}/${newNextLevelXp}`);
            const result = await this.userLevelModel.findOneAndUpdate({ userId }, {
                $set: {
                    level: newLevel,
                    xp: newXp,
                    nextLevelXp: newNextLevelXp
                }
            }, { new: true, upsert: true }).exec();
            if (!result) {
                throw new Error(`Failed to update XP for user: ${userId}`);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error awarding XP: ${error.message}`, error.stack);
            throw error;
        }
    }
    async awardXpToMultipleUsers(userIds, xpAmount) {
        try {
            this.logger.log(`Awarding ${xpAmount} XP to ${userIds.length} users`);
            const results = [];
            for (const userId of userIds) {
                try {
                    const result = await this.awardXp(userId, xpAmount);
                    if (result) {
                        results.push(result);
                    }
                }
                catch (error) {
                    this.logger.error(`Error awarding XP to user ${userId}: ${error.message}`);
                }
            }
            return results;
        }
        catch (error) {
            this.logger.error(`Error in bulk XP award: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = GamificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_level_schema_1.UserLevel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map