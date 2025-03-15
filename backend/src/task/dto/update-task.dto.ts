import { IsOptional, IsString, IsDate, IsEnum, IsArray, IsMongoId, ArrayNotEmpty } from 'class-validator';
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

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty({ message: 'Assigned users array cannot be empty' }) 
    @IsMongoId({ each: true, message: 'Each assigned user must be a valid MongoDB ObjectId' })
    assigned_to?: Types.ObjectId[];

    @IsString()
    @IsEnum(['add', 'remove'], { message: 'Invalid update action' })
    action: string = 'add';
}