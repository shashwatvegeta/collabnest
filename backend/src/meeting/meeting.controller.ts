import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { TaskService } from 'src/task/task.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Types } from 'mongoose';

@Controller('projects/:project_id/tasks/:task_id/meetings')
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly taskService: TaskService
  ) {}

  @Post()
  async createMeeting(
    @Param('task_id') task_id: string,
    @Body() createMeetingDto: CreateMeetingDto
  ) {
    const meeting = await this.meetingService.createMeeting(createMeetingDto);
    await this.taskService.addMeetingToTask(task_id, (meeting._id as Types.ObjectId).toString());
    return { message: 'Meeting created successfully', meeting };
  }


  @Get(':meeting_id')
  async getMeetingDetails(
    @Param('meeting_id') meeting_id: string
  ) {
    return await this.meetingService.getMeetingById(meeting_id);
  }
}