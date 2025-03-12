import { Model } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { UserSkill, UserSkillDocument } from './schemas/user-skill.schema';
import { CreateSkillDto, VerifySkillDto } from './dto/skill.dto';
export declare class SkillVerificationService {
    private skillModel;
    private userSkillModel;
    constructor(skillModel: Model<SkillDocument>, userSkillModel: Model<UserSkillDocument>);
    addSkill(createSkillDto: CreateSkillDto): Promise<import("mongoose").Document<unknown, {}, SkillDocument> & Skill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllSkills(): Promise<(import("mongoose").Document<unknown, {}, SkillDocument> & Skill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    verifySkill(verifySkillDto: VerifySkillDto): Promise<import("mongoose").Document<unknown, {}, UserSkillDocument> & UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserSkillStatus(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserSkillDocument> & UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    verifyUserSkill(userId: string, skillId: string): Promise<import("mongoose").Document<unknown, {}, UserSkillDocument> & UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getVerifiedSkills(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserSkillDocument> & UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
