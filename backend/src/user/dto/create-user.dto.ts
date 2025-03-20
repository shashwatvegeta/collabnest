import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export enum UserType {
  STUDENT = 'student',
  MENTOR = 'mentor',
  PROFESSOR = 'professor',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  isVerified: boolean;

  @IsString()
  @IsNotEmpty()
  roll_number: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  user_type: UserType;

  @IsOptional()
  student_skills: object[];

  @IsOptional()
  certificates: object[];

  @IsOptional()
  notifications: object[];

  @IsOptional()
  projects: object[];

  @IsOptional()
  project_application: object[];

  @IsOptional()
  rating: number;

  @IsOptional()
  achievements: object[];
}