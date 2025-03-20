import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLevel, UserLevelDocument } from './schemas/user-level.schema';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(@InjectModel(UserLevel.name) private userLevelModel: Model<UserLevelDocument>) {}

  async getUserLevel(userId: string): Promise<UserLevelDocument> {
    try {
      this.logger.log(`Getting user level for user: ${userId}`);
      let userLevel = await this.userLevelModel.findOne({ userId }).exec();
      
      // If user level doesn't exist, create a default one
      if (!userLevel) {
        this.logger.log(`Creating new user level for user: ${userId}`);
        userLevel = await this.userLevelModel.create({
          userId,
          level: 1,
          xp: 0,
          nextLevelXp: 600
        });
      }
      
      // Make sure nextLevelXp exists (for existing records that may not have it)
      if (userLevel && !userLevel.nextLevelXp) {
        this.logger.log(`Adding missing nextLevelXp for user: ${userId}`);
        userLevel = await this.userLevelModel.findOneAndUpdate(
          { userId },
          { $set: { nextLevelXp: 600 } },
          { new: true }
        ).exec();
      }
      
      // At this point, userLevel should never be null, but let's be safe
      if (!userLevel) {
        throw new Error(`Failed to create or retrieve user level for user: ${userId}`);
      }
      
      return userLevel;
    } catch (error) {
      this.logger.error(`Error getting user level: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateUserLevel(userId: string, updateLevelDto: UpdateLevelDto): Promise<UserLevelDocument> {
    try {
      this.logger.log(`Updating user level for user: ${userId}`);
      const result = await this.userLevelModel.findOneAndUpdate(
      { userId },
      { $set: updateLevelDto },
      { new: true, upsert: true }
    ).exec();
      
      if (!result) {
        throw new Error(`Failed to update user level for user: ${userId}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error updating user level: ${error.message}`, error.stack);
      throw error;
    }
  }

  async awardXp(userId: string, xpAmount: number): Promise<UserLevelDocument> {
    try {
      this.logger.log(`Awarding ${xpAmount} XP to user: ${userId}`);
      
      // Find the user's current level or create if not exists
      const userLevel = await this.getUserLevel(userId);
      
      if (!userLevel) {
        throw new Error(`Could not find or create user level for user: ${userId}`);
      }
      
      // Add XP to the user
      let newXp = userLevel.xp + xpAmount;
      let newLevel = userLevel.level;
      let newNextLevelXp = userLevel.nextLevelXp || 600; // Default to 600 if not set
      
      // Check if user leveled up
      while (newXp >= newNextLevelXp) {
        // Level up
        newLevel += 1;
        newXp -= newNextLevelXp;
        // Each level requires 600 XP
        newNextLevelXp = 600;
        this.logger.log(`User ${userId} leveled up to level ${newLevel}`);
      }
      
      // Update the user's level and XP
      this.logger.log(`Updating user ${userId} to level ${newLevel}, XP: ${newXp}/${newNextLevelXp}`);
      const result = await this.userLevelModel.findOneAndUpdate(
        { userId },
        { 
          $set: { 
            level: newLevel, 
            xp: newXp, 
            nextLevelXp: newNextLevelXp 
          } 
        },
        { new: true, upsert: true }
      ).exec();
      
      if (!result) {
        throw new Error(`Failed to update XP for user: ${userId}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error awarding XP: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Add a method to award XP to multiple users at once (for task completion)
  async awardXpToMultipleUsers(userIds: string[], xpAmount: number): Promise<UserLevelDocument[]> {
    try {
      this.logger.log(`Awarding ${xpAmount} XP to ${userIds.length} users`);
      const results: UserLevelDocument[] = [];
      
      for (const userId of userIds) {
        try {
          const result = await this.awardXp(userId, xpAmount);
          if (result) {
            results.push(result);
          }
        } catch (error) {
          this.logger.error(`Error awarding XP to user ${userId}: ${error.message}`);
          // Continue with other users even if one fails
        }
      }
      
      return results;
    } catch (error) {
      this.logger.error(`Error in bulk XP award: ${error.message}`, error.stack);
      throw error;
    }
  }
}