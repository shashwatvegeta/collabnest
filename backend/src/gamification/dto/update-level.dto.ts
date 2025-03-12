import { IsNumber } from 'class-validator';

export class UpdateLevelDto {
  @IsNumber()
  level: number;

  @IsNumber()
  xp: number;

  @IsNumber()
  nextLevelXp: number;
}