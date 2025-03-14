import { IsMongoId, IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateDiscussionDto {
    @IsMongoId()
    @IsOptional()
    Reply_Id?: string;

    @IsMongoId()
    @IsOptional()
    discussion_id?: string;

    @IsMongoId()
    @IsOptional()
    posted_by?: string;

    @IsString()
    @IsOptional()
    reply_message?: string;

    @IsDate()
    @IsOptional()
    posted_at?: Date;
}