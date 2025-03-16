import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback } from './feedback.schema';
import { Task } from 'src/task/task.schema';
import { Submissions } from 'src/submissions/submissions.schema';
import { Project } from 'src/project/project.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { DeleteResult } from 'mongodb'; // Import DeleteResult explicitly

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
    @InjectModel(Submissions.name) private readonly submissionModel: Model<Submissions>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async create(submission_id: string, create_feedback_dto: CreateFeedbackDto, user_id: string) {
    // Find submission
    const submission = await this.submissionModel.findById(submission_id);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Find task containing this submission
    const task = await this.taskModel.findOne({ submissions: new Types.ObjectId(submission_id) });
    if (!task) {
      throw new NotFoundException('Task not found for this submission');
    }

    // Find project containing this task
    const project = await this.projectModel.findOne({ tasks: task._id });
    if (!project) {
      throw new NotFoundException('Project not found for this submission');
    }

    // Check if user is the project owner
    if (project.project_owner.toString() !== user_id) {
      throw new ForbiddenException('Only the project owner can give feedback');
    }

    // Check if feedback already exists for this submission
    const existingFeedback = await this.feedbackModel.findOne({ submission_id });
    if (existingFeedback) {
      throw new ForbiddenException('Only one feedback is allowed per submission');
    }

    // Create new feedback
    const feedback = new this.feedbackModel({ ...create_feedback_dto, submission_id, user_id });
    
    await feedback.save();

    await this.submissionModel.findByIdAndUpdate(submission_id, {
      feedback_id: feedback._id
    })

    return feedback;
  }

  async findOne(submission_id: string, feedback_id: string, user_id: string) {
    // Find feedback
    const feedback = await this.feedbackModel.findOne({ _id: feedback_id, submission_id });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    // Find submission
    const submission = await this.submissionModel.findById(submission_id);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Find task containing this submission
    const task = await this.taskModel.findOne({ submissions: new Types.ObjectId(submission_id) });
    if (!task) {
      throw new NotFoundException('Task not found for this submission');
    }

    // Find project containing this task
    const project = await this.projectModel.findOne({ tasks: task._id });
    if (!project) {
      throw new NotFoundException('Project not found for this submission');
    }

    // Check if user is the submission owner or project owner
    if (submission.user_id.toString() !== user_id && project.project_owner.toString() !== user_id) {
      throw new ForbiddenException('Access denied');
    }

    return feedback;
  }

  async remove(submission_id: string, feedback_id: string, user_id: string): Promise<DeleteResult> {
    // Find feedback
    const feedback = await this.feedbackModel.findOne({ _id: feedback_id, submission_id });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    // Check if user is the feedback creator
    if (feedback.user_id.toString() !== user_id) {
      throw new ForbiddenException('Only the feedback creator can delete this feedback');
    }

    return await this.feedbackModel.deleteOne({ _id: feedback_id }) as unknown as DeleteResult;
  }
}