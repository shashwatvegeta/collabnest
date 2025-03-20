declare class ReplyDto {
    content: string;
    created_by: string;
    created_at?: Date;
    created_by_username: string;
}
export declare class UpdateDiscussionthreadDto {
    discussion_id?: string;
    title?: string;
    description?: string;
    created_by?: string;
    project_id?: string;
    replies?: ReplyDto[];
}
export {};
