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
    const objectIdProjectId = new Types.ObjectId(projectId);

    return this.discussionThreadModel.find({
      project_id: objectIdProjectId
    }).exec();
  }

  async findOne(projectId: string, discussionId: string): Promise<DiscussionThread> {
    // Convert string to ObjectId
    const objectIdProjectId = new Types.ObjectId(projectId);

    const thread = await this.discussionThreadModel.findOne({
      projects: objectIdProjectId,
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

      // Create the discussion thread with converted ObjectIds
      return this.discussionThreadModel.create({
        ...createDiscussionDto,
        discussion_id: createDiscussionDto.discussion_id ? new Types.ObjectId(createDiscussionDto.discussion_id) : new Types.ObjectId(),
        project_id: objectIdProjectId,
        created_by: createdBy,
        discussion_replies: []
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

    // Check if user has permission (creator or mentor/professor)
    if (discussionThread.created_by.toString() !== userObjectId.toString() && !isMentor) {
      throw new ForbiddenException('You do not have permission to update this discussion thread');
    }
    // Prepare update object with only fields that are provided
    const updateData: Partial<DiscussionThread> = {};

    if (updateDiscussionDto.title) {
      updateData.title = updateDiscussionDto.title;
    }

    if (updateDiscussionDto.description) {
      updateData.description = updateDiscussionDto.description;
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

    // Only mentor/professor can delete
    if (!isMentor) {
      throw new ForbiddenException('Only mentors or professors can delete discussion threads');
    }

    await this.discussionThreadModel.deleteOne({ _id: new Types.ObjectId(discussionId) }).exec();
  }
}