import { IsNotEmpty, IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  senderId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  receiverIds: string[];

  @IsString()
  @IsNotEmpty()
  message: string;
}
