import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
export declare class AchievementController {
    private readonly achievementService;
    constructor(achievementService: AchievementService);
    create(user_id: string, createAchievementDto: CreateAchievementDto): Promise<import("mongoose").Document<unknown, {}, import("./achievement.schema").Achievement> & import("./achievement.schema").Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(user_id: string): Promise<object[]>;
    findOne(user_id: string, achievement_id: string): Promise<import("mongoose").Document<unknown, {}, import("./achievement.schema").Achievement> & import("./achievement.schema").Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(user_id: string, achievement_id: string, updateAchievementDto: UpdateAchievementDto): Promise<import("mongoose").Document<unknown, {}, import("./achievement.schema").Achievement> & import("./achievement.schema").Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(user_id: string, achievement_id: string): Promise<import("mongoose").Document<unknown, {}, import("./achievement.schema").Achievement> & import("./achievement.schema").Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
