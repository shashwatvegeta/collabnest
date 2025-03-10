import { IsOptional, IsString, IsDate, IsEnum, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDate()
    deadline?: Date;

    @IsOptional()
    @IsEnum(['Pending', 'In Progress', 'Completed'], { message: 'Invalid status value' })
    status?: string;
}