import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DiscussionThread } from '../discussionthread/entities/discussionthread.entity';
import { CreateDiscussionthreadDto } from '../discussionthread/dto/create-discussionthread.dto';
import { UpdateDiscussionthreadDto } from '../discussionthread/dto/update-discussionthread.dto';

@Injectable()
export class DiscussionThreadsService {
  constructor(
    @InjectModel(DiscussionThread.name)
    private discussionThreadModel: Model<DiscussionThread>,
  ) { }

  async findAllByProject(projectId: string): Promise<DiscussionThread[]> {
    // Convert string to ObjectId

    return this.discussionThreadModel.find({
      project_id: new Types.ObjectId(projectId)
    }).exec();
  }

  async findOne(projectId: string, discussionId: string): Promise<DiscussionThread> {
    // Convert string to ObjectId
    const thread = await this.discussionThreadModel.findOne({
      project_id: new Types.ObjectId(projectId),
      _id: new Types.ObjectId(discussionId)
    }).exec();

    if (!thread) {
      throw new NotFoundException(`Discussion thread not found`);
    }

    return thread;
  }
  async create(projectId: string, createDiscussionDto: CreateDiscussionthreadDto, userId: string): Promise<DiscussionThread> {
    try {
      // Convert strings to ObjectIds
      const objectIdProjectId = new Types.ObjectId(projectId);
      const createdBy = new Types.ObjectId(createDiscussionDto.created_by || userId);
      const discussionId = new Types.ObjectId(); // Generate new discussion ID

      // Create the discussion thread with converted ObjectIds
      return this.discussionThreadModel.create({
        ...createDiscussionDto,
        discussion_id: discussionId,
        project_id: objectIdProjectId,
        created_by: createdBy,
        replies: [] // Initialize empty replies array
      });
    } catch (error) {
      console.error('Error creating discussion thread:', error);
      throw error;
    }
  }
  async update(projectId: string, discussionId: string, updateDiscussionDto: UpdateDiscussionthreadDto, userId: string, isMentor: boolean): Promise<DiscussionThread> {
    const discussionThread = await this.findOne(projectId, discussionId);
    let userObjectId;
    try {
      userObjectId = new Types.ObjectId(userId);
    } catch (error) {
      userObjectId = new Types.ObjectId('000000000000000000000000');
    }

    // Prepare update object with only fields that are provided
    const updateData: Partial<DiscussionThread> = {};

    if (updateDiscussionDto.title) {
      updateData.title = updateDiscussionDto.title;
    }

    if (updateDiscussionDto.description) {
      updateData.description = updateDiscussionDto.description;
    }

    // Handle replies array update
    if (updateDiscussionDto.replies) {
      // Convert created_by to ObjectId in each reply
      const formattedReplies = updateDiscussionDto.replies.map(reply => ({
        ...reply,
        created_by: new Types.ObjectId(reply.created_by),
        created_at: reply.created_at || new Date(),
        created_by_username: reply.created_by_username
      }));
      updateData.replies = formattedReplies;
    }

    // Use findOneAndUpdate instead of save()
    const updatedThread = await this.discussionThreadModel.findOneAndUpdate(
      { _id: new Types.ObjectId(discussionId) },
      { $set: updateData },
      { new: true } // Returns the updated document
    ).exec();

    if (!updatedThread) {
      throw new NotFoundException(`Discussion thread not found after update`);
    }

    return updatedThread;
  }

  async remove(projectId: string, discussionId: string, userId: string, isMentor: boolean): Promise<void> {
    const discussionThread = await this.findOne(projectId, discussionId);



    await this.discussionThreadModel.deleteOne({ _id: new Types.ObjectId(discussionId) }).exec();
  }
}