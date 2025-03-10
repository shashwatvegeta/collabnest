import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { Discussion } from './discussion.schema';
import { Model } from 'mongoose';
export declare class DiscussionService {
    private projectModel;
    constructor(projectModel: Model<Discussion>);
    create(createDiscussionDto: CreateDiscussionDto): Promise<import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: number): () => Promise<(import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(id: number, updateDiscussionDto: UpdateDiscussionDto): Promise<(import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    remove(id: number): Promise<(import("mongoose").Document<unknown, {}, Discussion> & Discussion & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
