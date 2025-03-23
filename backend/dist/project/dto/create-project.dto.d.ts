export declare class CreateProjectDto {
    project_name: string;
    project_id: number;
    is_approved: string;
    description: string;
    cap: number;
    start_date: Date;
    end_date: Date;
    project_owner: {
        user_type: string;
        [key: string]: any;
    };
}
