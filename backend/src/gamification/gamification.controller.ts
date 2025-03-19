import { Controller, Get, Put, Post, Param, Body, Logger, NotFoundException } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { UpdateLevelDto } from './dto/update-level.dto';

@Controller('users/:userId/gamification')
export class GamificationController {
  private readonly logger = new Logger(GamificationController.name);

  constructor(private readonly gamificationService: GamificationService) {}

  @Get('level')
  async getUserLevel(@Param('userId') userId: string) {
    this.logger.log(`Fetching level for userId: ${userId}`);
    
    try {
      const level = await this.gamificationService.getUserLevel(userId);
      this.logger.log(`Found level for userId ${userId}: Level ${level?.level}, XP ${level?.xp}/${level?.nextLevelXp}`);
      return level;
    } catch (error) {
      this.logger.error(`Error fetching level for userId ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Put('level')
  async updateUserLevel(@Param('userId') userId: string, @Body() updateLevelDto: UpdateLevelDto) {
    this.logger.log(`Updating level for userId: ${userId} with data: ${JSON.stringify(updateLevelDto)}`);
    
    try {
      const result = await this.gamificationService.updateUserLevel(userId, updateLevelDto);
      this.logger.log(`Updated level for userId ${userId}: Level ${result?.level}, XP ${result?.xp}/${result?.nextLevelXp}`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating level for userId ${userId}: ${error.message}`);
      throw error;
    }
  }

  @Post('award-xp')
  async awardXp(@Param('userId') userId: string, @Body() body: { xp: number }) {
    this.logger.log(`Awarding ${body.xp} XP to userId: ${userId}`);
    
    try {
      const result = await this.gamificationService.awardXp(userId, body.xp);
      this.logger.log(`Awarded XP for userId ${userId}: Now Level ${result?.level}, XP ${result?.xp}/${result?.nextLevelXp}`);
      return result;
    } catch (error) {
      this.logger.error(`Error awarding XP to userId ${userId}: ${error.message}`);
      throw error;
    }
  }
}

// Controller for operations not tied to a specific user
@Controller('gamification')
export class GamificationBulkController {
  private readonly logger = new Logger(GamificationBulkController.name);

  constructor(private readonly gamificationService: GamificationService) {}

  @Post('award-xp-bulk')
  async awardXpToMultipleUsers(@Body() body: { userIds: string[], xp: number }) {
    this.logger.log(`Bulk awarding ${body.xp} XP to ${body.userIds.length} users: ${body.userIds.join(', ')}`);
    
    try {
      const results = await this.gamificationService.awardXpToMultipleUsers(body.userIds, body.xp);
      this.logger.log(`Awarded XP to ${results.length} users successfully`);
      return results;
    } catch (error) {
      this.logger.error(`Error in bulk XP award: ${error.message}`);
      throw error;
    }
  }
}