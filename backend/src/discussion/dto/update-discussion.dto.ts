import { IsMongoId, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateDiscussionDto {
    @IsMongoId()
    @IsOptional()
    discussion_id?: string;
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsMongoId()
    @IsOptional()
    created_by?: string;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    discussion_replies?: string[];
}
