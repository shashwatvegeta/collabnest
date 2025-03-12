import { Document } from 'mongoose';
export declare class UserLevel extends Document {
    userId: string;
    level: number;
    xp: number;
    nextLevelXp: number;
}
export declare const UserLevelSchema: import("mongoose").Schema<UserLevel, import("mongoose").Model<UserLevel, any, any, any, Document<unknown, any, UserLevel> & UserLevel & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserLevel, Document<unknown, {}, import("mongoose").FlatRecord<UserLevel>> & import("mongoose").FlatRecord<UserLevel> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export type UserLevelDocument = UserLevel & Document;
