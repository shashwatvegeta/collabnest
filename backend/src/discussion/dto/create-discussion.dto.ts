import { IsMongoId, IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateDiscussionDto {
    @IsMongoId()
    @IsNotEmpty()
    Reply_Id: string;

    @IsMongoId()
    @IsNotEmpty()
    discussion_id: string;

    @IsMongoId()
    @IsNotEmpty()
    posted_by: string;

    @IsString()
    @IsNotEmpty()
    reply_message: string;

    @IsDate()
    @IsOptional()
    posted_at?: Date;
}