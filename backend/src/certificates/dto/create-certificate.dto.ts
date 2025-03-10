import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCertificateDto {
  @IsOptional()
  @IsString()
  certificate_id: string;

  @IsNotEmpty()
  project_id: Types.ObjectId;

  @IsNotEmpty()
  submission_id: Types.ObjectId;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsDate()
  generated_at: Date;
}