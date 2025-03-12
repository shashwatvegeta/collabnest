import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLevel, UserLevelSchema } from './schemas/user-level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLevel.name, schema: UserLevelSchema },
    ]),
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
})
export class GamificationModule {}