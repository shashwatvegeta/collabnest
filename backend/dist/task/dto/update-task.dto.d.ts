import { Types } from 'mongoose';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    deadline?: Date;
    status?: string;
    assigned_to?: Types.ObjectId[];
    action: string;
}
