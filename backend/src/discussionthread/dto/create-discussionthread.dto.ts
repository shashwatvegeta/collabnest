import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { IsArray } from 'class-validator';
export class CreateDiscussionthreadDto {
    @IsOptional()
    @IsString()
    discussion_id?: string; // Changed from UUID to string

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    created_by: string; // Changed from UUID to string

    @IsNotEmpty()
    @IsString()
    project_id: string; // Changed from UUID to string

    @IsOptional()
    @IsArray()
    discussion_replies?: string[]; // Optional array of reply IDs
}