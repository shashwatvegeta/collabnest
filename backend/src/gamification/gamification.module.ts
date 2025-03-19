import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamificationController, GamificationBulkController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { UserLevel, UserLevelSchema } from './schemas/user-level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLevel.name, schema: UserLevelSchema }
    ])
  ],
  controllers: [GamificationController, GamificationBulkController],
  providers: [GamificationService],
  exports: [GamificationService]
})
export class GamificationModule {}