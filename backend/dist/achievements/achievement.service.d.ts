import { Model } from 'mongoose';
import { Achievement } from './achievement.schema';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { User } from '../user/user.schema';
export declare class AchievementService {
    private achievementModel;
    private userModel;
    constructor(achievementModel: Model<Achievement>, userModel: Model<User>);
    create(user_id: string, createAchievementDto: CreateAchievementDto): Promise<import("mongoose").Document<unknown, {}, Achievement> & Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(user_id: string): Promise<object[]>;
    findOne(user_id: string, achievement_id: string): Promise<import("mongoose").Document<unknown, {}, Achievement> & Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(user_id: string, achievement_id: string, updateAchievementDto: UpdateAchievementDto): Promise<import("mongoose").Document<unknown, {}, Achievement> & Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(user_id: string, achievement_id: string): Promise<import("mongoose").Document<unknown, {}, Achievement> & Achievement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
