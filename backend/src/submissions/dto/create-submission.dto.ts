import { Types } from 'mongoose';
import { 
  IsNotEmpty, 
  IsString, 
  IsMongoId, 
  IsOptional, 
  IsDate 
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateSubmissionDto {

  @IsMongoId()
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => value || new Date()) // Default to current date if not provided
  @IsNotEmpty()
  submission_date: Date;

  @IsString()
  @IsOptional()
  submission_message?: string;

  @IsMongoId({ each: true }) // Ensures each file ID is valid
  @IsNotEmpty()
  files: Types.ObjectId[];
}
