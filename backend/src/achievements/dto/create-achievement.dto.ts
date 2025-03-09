import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAchievementDto {
  @IsOptional()
  @IsString()
  achievement_id: string;

  @IsNotEmpty()
  skills_id: Types.ObjectId;

  @IsNotEmpty()
  projects_id: Types.ObjectId;
}