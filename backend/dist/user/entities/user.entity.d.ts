export declare enum UserType {
    STUDENT = "student",
    MENTOR = "mentor",
    PROFESSOR = "professor"
}
export declare class User {
    user_id: string;
    username: string;
    password: string;
    email: string;
    isVerified: boolean;
    roll_number: string;
    notifications: object[];
    projects: object[];
    user_type: UserType;
    student_skills: object[];
    certificates: object[];
    project_application: object[];
    rating: number;
    achievements: object[];
}
