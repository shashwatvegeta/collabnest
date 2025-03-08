export declare class Project {
    name: string;
    project_id: number;
    is_approved: boolean;
    description: string;
    is_completed: boolean;
    cap: number;
    start_date: Date;
    end_date: Date;
    discussion_threads: Object[];
    tags: Object[];
    project_owner: number;
    students_enrolled: Object[];
    tasks: Object[];
    project_application: Object[];
}
