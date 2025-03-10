export declare enum UserType {
    STUDENT = "student",
    MENTOR = "mentor",
    PROFESSOR = "professor"
}
export declare class CreateUserDto {
    username: string;
    password: string;
    email: string;
    isVerified: boolean;
    roll_number: string;
    user_type: UserType;
    student_skills: object[];
    certificates: object[];
    notifications: object[];
    projects: object[];
    project_application: object[];
    rating: number;
    achievements: object[];
}
