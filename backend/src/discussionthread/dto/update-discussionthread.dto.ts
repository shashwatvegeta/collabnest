import { IsNotEmpty, IsString, IsUUID, IsOptional, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

class ReplyDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    created_by: string;

    @IsOptional()
    @IsDate()
    created_at?: Date;
    @IsString()
    @IsNotEmpty()
    created_by_username: string;


}

export class UpdateDiscussionthreadDto {
    @IsOptional()
    @IsString()
    discussion_id?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    created_by?: string;

    @IsOptional()
    @IsString()
    project_id?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReplyDto)
    replies?: ReplyDto[];
}