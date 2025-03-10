import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Controller('users/:user_id/achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  create(
    @Param('user_id') user_id: string,
    @Body() createAchievementDto: CreateAchievementDto,
  ) {
    return this.achievementService.create(user_id, createAchievementDto);
  }

  @Get()
  findAll(@Param('user_id') user_id: string) {
    return this.achievementService.findAll(user_id);
  }

  @Get(':achievement_id')
  findOne(
    @Param('user_id') user_id: string,
    @Param('achievement_id') achievement_id: string,
  ) {
    return this.achievementService.findOne(user_id, achievement_id);
  }

  @Put(':achievement_id')
  update(
    @Param('user_id') user_id: string,
    @Param('achievement_id') achievement_id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementService.update(user_id, achievement_id, updateAchievementDto);
  }

  @Delete(':achievement_id')
  remove(
    @Param('user_id') user_id: string,
    @Param('achievement_id') achievement_id: string,
  ) {
    return this.achievementService.remove(user_id, achievement_id);
  }
}