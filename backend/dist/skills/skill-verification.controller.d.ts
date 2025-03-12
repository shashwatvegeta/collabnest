import { SkillVerificationService } from './skill-verification.service';
import { CreateSkillDto, VerifySkillDto } from './dto/skill.dto';
export declare class SkillVerificationController {
    private readonly skillService;
    constructor(skillService: SkillVerificationService);
    addSkill(createSkillDto: CreateSkillDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/skill.schema").SkillDocument> & import("./schemas/skill.schema").Skill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllSkills(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/skill.schema").SkillDocument> & import("./schemas/skill.schema").Skill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    verifySkill(verifySkillDto: VerifySkillDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user-skill.schema").UserSkillDocument> & import("./schemas/user-skill.schema").UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserSkillStatus(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user-skill.schema").UserSkillDocument> & import("./schemas/user-skill.schema").UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    verifyUserSkill(userId: string, skillId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user-skill.schema").UserSkillDocument> & import("./schemas/user-skill.schema").UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getVerifiedSkills(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user-skill.schema").UserSkillDocument> & import("./schemas/user-skill.schema").UserSkill & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
