import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { AchievementSchema } from './achievement.schema';
import { UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Achievement', schema: AchievementSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
})
export class AchievementModule {}