import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { Types } from 'mongoose';

// Custom pipe for ObjectId validation
class ValidateObjectId {
  transform(value: string): string {
    const isValid = Types.ObjectId.isValid(value);
    if (!isValid) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  }
}


@Controller('discussions/:discussion_id/discussion_post')
export class DiscussionPostController {
  constructor(private readonly discussionService: DiscussionService) { }

  @Get()
  findAllPosts(@Param('discussion_id', ValidateObjectId) discussion_id: string) {
    return this.discussionService.findAllPosts(discussion_id);
  }

  @Post()
  createPost(
    @Param('discussion_id', ValidateObjectId) discussion_id: string,
    @Body() createDiscussionDto: CreateDiscussionDto,
  ) {
    return this.discussionService.createPost(discussion_id, createDiscussionDto);
  }

  @Put(':post_id')
  updatePost(
    @Param('discussion_id', ValidateObjectId) discussion_id: string,
    @Param('post_id', ValidateObjectId) post_id: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
  ) {
    return this.discussionService.updatePost(discussion_id, post_id, updateDiscussionDto);
  }

  @Delete(':post_id')
  deletePost(
    @Param('discussion_id', ValidateObjectId) discussion_id: string,
    @Param('post_id', ValidateObjectId) post_id: string,
  ) {
    return this.discussionService.deletePost(discussion_id, post_id);
  }
}