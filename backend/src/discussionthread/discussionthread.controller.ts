import { Controller, Get, Post, Body, Put, Param, Delete, Request } from '@nestjs/common';
import { DiscussionThreadsService } from '../discussionthread/discussionthread.service';
import { CreateDiscussionthreadDto } from '../discussionthread/dto/create-discussionthread.dto';
import { DiscussionThread } from '../discussionthread/entities/discussionthread.entity';
import { UpdateDiscussionthreadDto } from '../discussionthread/dto/update-discussionthread.dto';

@Controller('projects/:projectId/discussion')
export class DiscussionThreadsController {
  constructor(private readonly discussionThreadsService: DiscussionThreadsService) { }

  @Get()
  findAll(@Param('projectId') projectId: string): Promise<DiscussionThread[]> {
    // Fetches all discussion threads for a specific project
    return this.discussionThreadsService.findAllByProject(projectId);
  }

  @Get(':disc_id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('disc_id') discussionId: string
  ): Promise<DiscussionThread> {
    // Gets a project's discussion for the specific pid and disc_id
    return this.discussionThreadsService.findOne(projectId, discussionId);
  }

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createDiscussionDto: CreateDiscussionthreadDto,
    @Request() req
  ): Promise<DiscussionThread> {
    // Adds a new comment or thread to the project discussion
    return this.discussionThreadsService.create(
      projectId,
      createDiscussionDto,
      req.user?.id || 'anonymous'
    );
  }

  @Put(':disc_id')
  update(
    @Param('projectId') projectId: string,
    @Param('disc_id') discussionId: string,
    @Body() updateDiscussionDto: UpdateDiscussionthreadDto,
    @Request() req
  ): Promise<DiscussionThread> {
    // Change a discussion description or title
    const isMentor = req.user?.isMentor || req.user?.isProfessor || false;

    return this.discussionThreadsService.update(
      projectId,
      discussionId,
      updateDiscussionDto,
      req.user?.id || 'anonymous',
      isMentor
    );
  }

  @Delete(':disc_id')
  remove(
    @Param('projectId') projectId: string,
    @Param('disc_id') discussionId: string,
    @Request() req
  ): Promise<void> {
    // Delete a discussion (mentor/professor will have authority)
    const isMentor = req.user?.isMentor || req.user?.isProfessor || false;

    return this.discussionThreadsService.remove(
      projectId,
      discussionId,
      req.user?.id || 'anonymous',
      isMentor
    );
  }
}