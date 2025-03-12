import { Module } from '@nestjs/common';
import { SkillVerificationController } from './skill-verification.controller';
import { SkillVerificationService } from './skill-verification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './schemas/skill.schema';
import { UserSkill, UserSkillSchema } from './schemas/user-skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Skill.name, schema: SkillSchema },
      { name: UserSkill.name, schema: UserSkillSchema },
    ]),
  ],
  controllers: [SkillVerificationController],
  providers: [SkillVerificationService],
})
export class SkillVerificationModule {}