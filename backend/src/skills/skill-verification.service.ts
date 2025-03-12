import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { UserSkill, UserSkillDocument } from './schemas/user-skill.schema';
import { CreateSkillDto, VerifySkillDto } from './dto/skill.dto';

@Injectable()
export class SkillVerificationService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
    @InjectModel(UserSkill.name) private userSkillModel: Model<UserSkillDocument>
  ) {}

  async addSkill(createSkillDto: CreateSkillDto) {
    const newSkill = new this.skillModel(createSkillDto);
    return newSkill.save();
  }

  async getAllSkills() {
    return this.skillModel.find().exec();
  }

  async verifySkill(verifySkillDto: VerifySkillDto) {
    return this.userSkillModel.create(verifySkillDto);
  }

  async getUserSkillStatus(userId: string) {
    return this.userSkillModel.find({ userId }).exec();
  }

  async verifyUserSkill(userId: string, skillId: string) {
    return this.userSkillModel.create({ userId, skillId, verified: true });
  }

  async getVerifiedSkills(userId: string) {
    return this.userSkillModel.find({ userId, verified: true }).exec();
  }
}