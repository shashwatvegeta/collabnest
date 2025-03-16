import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('submissions/:submission_id/feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Function to return a hardcoded user_id (Replace this when auth is ready)
  private getHardcodedUserId(): string {
    return '67cbd709f08fb1b143c0b7db';
    // return '67cbd709f08fb1b143c0b7da'; // Replace with a valid ObjectId from your database
  }

  @Post()
  create(
    @Param('submission_id') submission_id: string,
    @Body() create_feedback_dto: CreateFeedbackDto,
  ) {
    const user_id = this.getHardcodedUserId();
    return this.feedbackService.create(submission_id, create_feedback_dto, user_id);
  }

  @Get(':feedback_id')
  findOne(
    @Param('submission_id') submission_id: string,
    @Param('feedback_id') feedback_id: string,
  ) {
    const user_id = this.getHardcodedUserId();
    return this.feedbackService.findOne(submission_id, feedback_id, user_id);
  }

  @Delete(':feedback_id')
  remove(
    @Param('submission_id') submission_id: string,
    @Param('feedback_id') feedback_id: string,
  ) {
    const user_id = this.getHardcodedUserId();
    return this.feedbackService.remove(submission_id, feedback_id, user_id);
  }
}
