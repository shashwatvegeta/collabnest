import { Document } from 'mongoose';
export declare class Skill extends Document {
    name: string;
}
export declare const SkillSchema: import("mongoose").Schema<Skill, import("mongoose").Model<Skill, any, any, any, Document<unknown, any, Skill> & Skill & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Skill, Document<unknown, {}, import("mongoose").FlatRecord<Skill>> & import("mongoose").FlatRecord<Skill> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export type SkillDocument = Skill & Document;
