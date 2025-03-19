declare class ReplyDto {
    content: string;
    created_by: string;
    created_at?: Date;
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
