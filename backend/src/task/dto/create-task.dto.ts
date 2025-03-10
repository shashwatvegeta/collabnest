import { IsNotEmpty, IsString, IsDate, IsEnum, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto {
    @IsOptional()
    project_id: Types.ObjectId;

    @IsNotEmpty()
    task_id: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDate()
    deadline: Date;

    @IsNotEmpty()
    @IsEnum(['Pending', 'In Progress', 'Completed'], { message: 'Invalid status value' })
    status: string;

    @IsArray()
    submissions?: Types.ObjectId[];

    @IsArray()
    meetings?: Types.ObjectId[];
}