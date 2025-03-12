import { Model } from 'mongoose';
import { DiscussionThread } from '../discussionthread/entities/discussionthread.entity';
import { CreateDiscussionthreadDto } from '../discussionthread/dto/create-discussionthread.dto';
import { UpdateDiscussionthreadDto } from '../discussionthread/dto/update-discussionthread.dto';
export declare class DiscussionThreadsService {
    private discussionThreadModel;
    constructor(discussionThreadModel: Model<DiscussionThread>);
    findAllByProject(projectId: string): Promise<DiscussionThread[]>;
    findOne(projectId: string, discussionId: string): Promise<DiscussionThread>;
    create(projectId: string, createDiscussionDto: CreateDiscussionthreadDto, userId: string): Promise<DiscussionThread>;
    update(projectId: string, discussionId: string, updateDiscussionDto: UpdateDiscussionthreadDto, userId: string, isMentor: boolean): Promise<DiscussionThread>;
    remove(projectId: string, discussionId: string, userId: string, isMentor: boolean): Promise<void>;
}
