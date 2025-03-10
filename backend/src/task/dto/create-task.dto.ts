import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsEnum, IsArray, IsOptional, IsISO8601 } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    deadline: Date;

    @IsOptional()
    @IsEnum(['Pending', 'In Progress', 'Completed'], { message: 'Invalid status value' })
    status?: string = "Pending";
}