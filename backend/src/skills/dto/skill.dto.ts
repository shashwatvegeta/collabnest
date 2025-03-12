import { IsString, IsBoolean } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;
}

export class VerifySkillDto {
  @IsString()
  userId: string;

  @IsString()
  skillId: string;

  @IsBoolean()
  verified: boolean;
}
