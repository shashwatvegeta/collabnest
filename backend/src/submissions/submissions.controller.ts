import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionGuard } from 'src/guard/submission.guard';
import { TaskAssignedGuard } from 'src/guard/task-assigned.guard';

@Controller('tasks/:task_id/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // Only students who have been assigned this task can make changes
  // @UseGuards(TaskAssignedGuard)
  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto, @Param('task_id') task_id: string) {
    return this.submissionsService.create(createSubmissionDto,task_id);
  }

  @Get()
  findAll(@Param('task_id') task_id: string) {
    return this.submissionsService.findAll(task_id);
  }

  // Use these guards so that only user who has done the submission
  // and the project owner have the access
  // @UseGuards(SubmissionGuard) 
  @Get(':submission_id')
  findOne(@Param('submission_id') submission_id: string, @Param('task_id') task_id: string) {
    return this.submissionsService.findOne(task_id, submission_id);
  }

  // Use these guards so that only user who has done the submission
  // and the project owner have the access
  // @UseGuards(SubmissionGuard) 
  @Delete(':submission_id')
  remove(@Param('submission_id') submission_id: string, @Param('task_id') task_id: string) {
    return this.submissionsService.remove(task_id, submission_id);
  }
}

