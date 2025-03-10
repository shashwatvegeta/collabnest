import { Model } from 'mongoose';
import { Discussion } from './discussion.schema';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
export declare class DiscussionService {
    private discussionModel;
    constructor(discussionModel: Model<Discussion>);
    findAllPosts(discussion_id: string): Promise<(import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    createPost(discussion_id: string, createDiscussionDto: CreateDiscussionDto): Promise<import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePost(discussion_id: string, post_id: string, updateDiscussionDto: UpdateDiscussionDto): Promise<(import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deletePost(discussion_id: string, post_id: string): Promise<(import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
