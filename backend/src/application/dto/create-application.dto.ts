import { Types } from "mongoose";
import { IsMongoId, IsString, IsOptional, IsUrl, IsEnum, IsDate } from "class-validator";

export class CreateApplicationDto {
    @IsString()
    user_id: string;

    @IsOptional()
    project_id: Types.ObjectId;

    @IsEnum(["pending", "under_review", "accepted", "rejected"]) // Allowed values
    status: string = "pending"; // Default value

    @IsOptional()
    @IsString()
    motivation_statement?: string;

    @IsString()
    resume_link: string;

    @IsDate()
    submission_date: Date = new Date(); // Default to current date
}
