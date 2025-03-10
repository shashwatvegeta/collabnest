import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discussion } from './discussion.schema';

import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectModel('Discussion') private discussionModel: Model<Discussion>,

  ) { }

  async findAllPosts(discussion_id: string) {
    const discussion = await this.discussionModel.findById(discussion_id).exec();
    if (!discussion) {
      throw new NotFoundException(`Discussion with ID ${discussion_id} not found`);
    }

    return this.discussionModel.find({ discussion_id }).exec();
  }

  async createPost(discussion_id: string, createDiscussionDto: CreateDiscussionDto) {
    // Verify discussion exists
    const discussion = await this.discussionModel.findById(discussion_id).exec();
    if (!discussion) {
      throw new NotFoundException(`Discussion with ID ${discussion_id} not found`);
    }

    // Create new post
    const postData = {
      ...createDiscussionDto,
      discussion_id
    };

    const createdPost = new this.discussionModel(postData);
    const savedPost = await createdPost.save();

    // Update discussion's replies array
    await this.discussionModel.findByIdAndUpdate(
      discussion_id,
      { $push: { 'Discussion Replies': savedPost._id } },
      { new: true }
    ).exec();

    return savedPost;
  }

  async updatePost(discussion_id: string, post_id: string, updateDiscussionDto: UpdateDiscussionDto) {
    const discussion = await this.discussionModel.findById(discussion_id).exec();
    if (!discussion) {
      throw new NotFoundException(`Discussion with ID ${discussion_id} not found`);
    }

    const post = await this.discussionModel.findById(post_id).exec();
    if (!post) {
      throw new NotFoundException(`Discussion post with ID ${post_id} not found`);
    }

    // Check if post belongs to the discussion
    if (post.discussion_id.toString() !== discussion_id) {
      throw new NotFoundException(`Post doesn't belong to the specified discussion`);
    }

    return this.discussionModel.findByIdAndUpdate(
      post_id,
      updateDiscussionDto,
      { new: true }
    ).exec();
  }

  async deletePost(discussion_id: string, post_id: string) {
    const discussion = await this.discussionModel.findById(discussion_id).exec();
    if (!discussion) {
      throw new NotFoundException(`Discussion with ID ${discussion_id} not found`);
    }

    const post = await this.discussionModel.findById(post_id).exec();
    if (!post) {
      throw new NotFoundException(`Discussion post with ID ${post_id} not found`);
    }

    // Check if post belongs to the discussion
    if (post.discussion_id.toString() !== discussion_id) {
      throw new NotFoundException(`Post doesn't belong to the specified discussion`);
    }

    const deletedPost = await this.discussionModel.findByIdAndDelete(post_id).exec();

    // Remove post from discussion's replies array
    await this.discussionModel.findByIdAndUpdate(
      discussion_id,
      { $pull: { 'Discussion Replies': post_id } }
    ).exec();

    return deletedPost;
  }
}