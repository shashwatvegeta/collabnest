import { Document, Types } from "mongoose";
export declare enum UserType {
    STUDENT = "student",
    MENTOR = "mentor",
    PROFESSOR = "professor"
}
export declare class User extends Document {
    username: string;
    password: string;
    email: string;
    isVerified: boolean;
    roll_number: string;
    notifications: Types.ObjectId[];
    projects: Types.ObjectId[];
    user_type: string;
    student_skills: object[];
    certificates: object[];
    project_application: Types.ObjectId[];
    rating: number;
    achievements: object[];
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
