import { Model } from 'mongoose';
import { UserLevelDocument } from './schemas/user-level.schema';
import { UpdateLevelDto } from './dto/update-level.dto';
export declare class GamificationService {
    private userLevelModel;
    private readonly logger;
    constructor(userLevelModel: Model<UserLevelDocument>);
    getUserLevel(userId: string): Promise<UserLevelDocument>;
    updateUserLevel(userId: string, updateLevelDto: UpdateLevelDto): Promise<UserLevelDocument>;
    awardXp(userId: string, xpAmount: number): Promise<UserLevelDocument>;
    awardXpToMultipleUsers(userIds: string[], xpAmount: number): Promise<UserLevelDocument[]>;
}
