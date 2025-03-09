import { IsDate, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdateApplicationDto {
    @IsDate()
    @Type(() => Date)
    review_date: Date = new Date();

    @IsString()
    @IsOptional()
    status?: string;

    @IsOptional()
    @IsString()
    rejection_reason?: string; 

    @IsOptional()
    @IsString()
    approval_notes?: string;
}
