import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { UpdateLevelDto } from './dto/update-level.dto';

@Controller('users/:userId/gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('level')
  async getUserLevel(@Param('userId') userId: string) {
    return this.gamificationService.getUserLevel(userId);
  }

  @Put('level')
  async updateUserLevel(@Param('userId') userId: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.gamificationService.updateUserLevel(userId, updateLevelDto);
  }
}