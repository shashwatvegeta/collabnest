import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateDiscussionDto {
    @IsMongoId()
    @IsNotEmpty()
    discussion_id: string;
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsMongoId()
    @IsNotEmpty()
    created_by: string;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    discussion_replies?: string[];
}
