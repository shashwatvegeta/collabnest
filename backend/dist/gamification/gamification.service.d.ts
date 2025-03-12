import { Model } from 'mongoose';
import { UserLevel, UserLevelDocument } from './schemas/user-level.schema';
import { UpdateLevelDto } from './dto/update-level.dto';
export declare class GamificationService {
    private userLevelModel;
    constructor(userLevelModel: Model<UserLevelDocument>);
    getUserLevel(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserLevelDocument> & UserLevel & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateUserLevel(userId: string, updateLevelDto: UpdateLevelDto): Promise<import("mongoose").Document<unknown, {}, UserLevelDocument> & UserLevel & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
