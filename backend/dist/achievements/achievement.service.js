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
exports.AchievementService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AchievementService = class AchievementService {
    achievementModel;
    userModel;
    constructor(achievementModel, userModel) {
        this.achievementModel = achievementModel;
        this.userModel = userModel;
    }
    async create(user_id, createAchievementDto) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const createdAchievement = new this.achievementModel(createAchievementDto);
        const savedAchievement = await createdAchievement.save();
        await this.userModel.findByIdAndUpdate(user_id, { $push: { achievements: savedAchievement._id } }, { new: true }).exec();
        return savedAchievement;
    }
    async findAll(user_id) {
        const user = await this.userModel.findById(user_id)
            .populate('achievements')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        return user.achievements;
    }
    async findOne(user_id, achievement_id) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const achievement = await this.achievementModel.findById(achievement_id)
            .populate('skills_id')
            .populate('projects_id')
            .exec();
        if (!achievement) {
            throw new common_1.NotFoundException(`Achievement with ID ${achievement_id} not found`);
        }
        return achievement;
    }
    async update(user_id, achievement_id, updateAchievementDto) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const achievement = await this.achievementModel.findByIdAndUpdate(achievement_id, updateAchievementDto, { new: true }).exec();
        if (!achievement) {
            throw new common_1.NotFoundException(`Achievement with ID ${achievement_id} not found`);
        }
        return achievement;
    }
    async remove(user_id, achievement_id) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const deletedAchievement = await this.achievementModel.findByIdAndDelete(achievement_id).exec();
        if (!deletedAchievement) {
            throw new common_1.NotFoundException(`Achievement with ID ${achievement_id} not found`);
        }
        await this.userModel.findByIdAndUpdate(user_id, { $pull: { achievements: achievement_id } }).exec();
        return deletedAchievement;
    }
};
exports.AchievementService = AchievementService;
exports.AchievementService = AchievementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Achievement')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AchievementService);
//# sourceMappingURL=achievement.service.js.map