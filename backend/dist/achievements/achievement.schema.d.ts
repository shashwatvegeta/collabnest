import { Document, Types } from "mongoose";
export declare class Achievement extends Document {
    achievement_id: Types.ObjectId;
    skills_id: Types.ObjectId;
    projects_id: Types.ObjectId;
}
export declare const AchievementSchema: import("mongoose").Schema<Achievement, import("mongoose").Model<Achievement, any, any, any, Document<unknown, any, Achievement> & Achievement & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Achievement, Document<unknown, {}, import("mongoose").FlatRecord<Achievement>> & import("mongoose").FlatRecord<Achievement> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
