import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
export declare class DiscussionPostController {
    private readonly discussionService;
    constructor(discussionService: DiscussionService);
    findAllPosts(discussion_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./discussion.schema").Discussion> & import("./discussion.schema").Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    createPost(discussion_id: string, createDiscussionDto: CreateDiscussionDto): Promise<import("mongoose").Document<unknown, {}, import("./discussion.schema").Discussion> & import("./discussion.schema").Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePost(discussion_id: string, post_id: string, updateDiscussionDto: UpdateDiscussionDto): Promise<(import("mongoose").Document<unknown, {}, import("./discussion.schema").Discussion> & import("./discussion.schema").Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deletePost(discussion_id: string, post_id: string): Promise<(import("mongoose").Document<unknown, {}, import("./discussion.schema").Discussion> & import("./discussion.schema").Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
