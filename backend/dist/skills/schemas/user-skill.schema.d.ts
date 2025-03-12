import { Document } from 'mongoose';
export declare class UserSkill extends Document {
    userId: string;
    skillId: string;
    verified: boolean;
}
export declare const UserSkillSchema: import("mongoose").Schema<UserSkill, import("mongoose").Model<UserSkill, any, any, any, Document<unknown, any, UserSkill> & UserSkill & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserSkill, Document<unknown, {}, import("mongoose").FlatRecord<UserSkill>> & import("mongoose").FlatRecord<UserSkill> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export type UserSkillDocument = UserSkill & Document;
