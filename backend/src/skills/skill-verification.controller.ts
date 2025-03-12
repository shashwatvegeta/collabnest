import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SkillVerificationService } from './skill-verification.service';
import { CreateSkillDto, VerifySkillDto } from './dto/skill.dto';

@Controller('skills')
export class SkillVerificationController {
  constructor(private readonly skillService: SkillVerificationService) {}

  @Post()
  async addSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.addSkill(createSkillDto);
  }

  @Get()
  async getAllSkills() {
    return this.skillService.getAllSkills();
  }

  @Post('verify')
  async verifySkill(@Body() verifySkillDto: VerifySkillDto) {
    return this.skillService.verifySkill(verifySkillDto);
  }

  @Get('status/user/:userId')
  async getUserSkillStatus(@Param('userId') userId: string) {
    return this.skillService.getUserSkillStatus(userId);
  }

  @Post('/users/:userId/skills/:skillId/verify')
  async verifyUserSkill(@Param('userId') userId: string, @Param('skillId') skillId: string) {
    return this.skillService.verifyUserSkill(userId, skillId);
  }

  @Get('/users/:userId/skills')
  async getVerifiedSkills(@Param('userId') userId: string) {
    return this.skillService.getVerifiedSkills(userId);
  }
}