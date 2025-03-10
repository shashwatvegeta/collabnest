import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement } from './achievement.schema';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { User } from '../user/user.schema';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel('Achievement') private achievementModel: Model<Achievement>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(user_id: string, createAchievementDto: CreateAchievementDto) {
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const createdAchievement = new this.achievementModel(createAchievementDto);
    const savedAchievement = await createdAchievement.save();
    
    // Add achievement to user's achievements array
    await this.userModel.findByIdAndUpdate(
      user_id,
      { $push: { achievements: savedAchievement._id } },
      { new: true }
    ).exec();
    
    return savedAchievement;
  }

  async findAll(user_id: string) {
    const user = await this.userModel.findById(user_id)
      .populate('achievements')
      .exec();
      
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    return user.achievements;
  }

  async findOne(user_id: string, achievement_id: string) {
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    const achievement = await this.achievementModel.findById(achievement_id)
      .populate('skills_id')
      .populate('projects_id')
      .exec();
      
    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${achievement_id} not found`);
    }
    
    return achievement;
  }

  async update(user_id: string, achievement_id: string, updateAchievementDto: UpdateAchievementDto) {
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    const achievement = await this.achievementModel.findByIdAndUpdate(
      achievement_id, 
      updateAchievementDto,
      { new: true }
    ).exec();
    
    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${achievement_id} not found`);
    }
    
    return achievement;
  }

  async remove(user_id: string, achievement_id: string) {
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    const deletedAchievement = await this.achievementModel.findByIdAndDelete(achievement_id).exec();
    if (!deletedAchievement) {
      throw new NotFoundException(`Achievement with ID ${achievement_id} not found`);
    }
    
    // Remove achievement from user's achievements array
    await this.userModel.findByIdAndUpdate(
      user_id,
      { $pull: { achievements: achievement_id } }
    ).exec();
    
    return deletedAchievement;
  }
}