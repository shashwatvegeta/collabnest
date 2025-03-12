import { GamificationService } from './gamification.service';
import { UpdateLevelDto } from './dto/update-level.dto';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getUserLevel(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user-level.schema").UserLevelDocument> & import("./schemas/user-level.schema").UserLevel & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateUserLevel(userId: string, updateLevelDto: UpdateLevelDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user-level.schema").UserLevelDocument> & import("./schemas/user-level.schema").UserLevel & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
