import { IsNotEmpty, IsMongoId } from 'class-validator';

export class MarkAsReadDto {
  @IsMongoId()
  @IsNotEmpty()
  notificationId: string;

  @IsMongoId()
  @IsNotEmpty()
  readerId: string;
}
