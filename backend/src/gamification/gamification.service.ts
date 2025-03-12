import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLevel, UserLevelDocument } from './schemas/user-level.schema';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class GamificationService {
  constructor(@InjectModel(UserLevel.name) private userLevelModel: Model<UserLevelDocument>) {}

  async getUserLevel(userId: string) {
    return this.userLevelModel.findOne({ userId }).exec();
  }

  async updateUserLevel(userId: string, updateLevelDto: UpdateLevelDto) {
    return this.userLevelModel.findOneAndUpdate(
      { userId },
      { $set: updateLevelDto },
      { new: true, upsert: true }
    ).exec();
  }
}