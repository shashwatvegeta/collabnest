import { Types } from 'mongoose';
export declare class CreateAchievementDto {
    achievement_id: string;
    skills_id: Types.ObjectId;
    projects_id: Types.ObjectId;
}
