import { DiscussionThreadsService } from '../discussionthread/discussionthread.service';
import { CreateDiscussionthreadDto } from '../discussionthread/dto/create-discussionthread.dto';
import { DiscussionThread } from '../discussionthread/entities/discussionthread.entity';
import { UpdateDiscussionthreadDto } from '../discussionthread/dto/update-discussionthread.dto';
export declare class DiscussionThreadsController {
    private readonly discussionThreadsService;
    constructor(discussionThreadsService: DiscussionThreadsService);
    findAll(projectId: string): Promise<DiscussionThread[]>;
    findOne(projectId: string, discussionId: string): Promise<DiscussionThread>;
    create(projectId: string, createDiscussionDto: CreateDiscussionthreadDto, req: any): Promise<DiscussionThread>;
    update(projectId: string, discussionId: string, updateDiscussionDto: UpdateDiscussionthreadDto, req: any): Promise<DiscussionThread>;
    remove(projectId: string, discussionId: string, req: any): Promise<void>;
}
