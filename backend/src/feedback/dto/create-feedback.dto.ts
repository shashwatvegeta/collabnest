import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFeedbackDto {
    @IsNotEmpty()
    @IsString()
    feedback_message: string;

    @IsNotEmpty()
    @IsArray()
    files: Types.ObjectId[];
}