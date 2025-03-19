import { GamificationService } from './gamification.service';
import { UpdateLevelDto } from './dto/update-level.dto';
export declare class GamificationController {
    private readonly gamificationService;
    private readonly logger;
    constructor(gamificationService: GamificationService);
    getUserLevel(userId: string): Promise<import("./schemas/user-level.schema").UserLevelDocument>;
    updateUserLevel(userId: string, updateLevelDto: UpdateLevelDto): Promise<import("./schemas/user-level.schema").UserLevelDocument>;
    awardXp(userId: string, body: {
        xp: number;
    }): Promise<import("./schemas/user-level.schema").UserLevelDocument>;
}
export declare class GamificationBulkController {
    private readonly gamificationService;
    private readonly logger;
    constructor(gamificationService: GamificationService);
    awardXpToMultipleUsers(body: {
        userIds: string[];
        xp: number;
    }): Promise<import("./schemas/user-level.schema").UserLevelDocument[]>;
}
