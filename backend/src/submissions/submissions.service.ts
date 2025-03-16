import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submissions } from './submissions.schema';
import { Task } from 'src/task/task.schema';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel('Submission') private submissionModel: Model<Submissions>,
    @InjectModel('Task') private taskModel: Model<Task>
  ) { }

  async create(createSubmissionDto: CreateSubmissionDto, taskId: string) {
    // Fetch the task to check the deadline
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Ensure submission date is not after the task deadline
    if (new Date(Date.now()) > new Date(task.deadline)) {
      throw new Error('Submission date cannot be after the task deadline');
    }

    // Create submission
    const createdSubmission = new this.submissionModel(createSubmissionDto);
    const savedSubmission = await createdSubmission.save();

    // Link submission to task
    await this.taskModel.findByIdAndUpdate(taskId, {
      $push: { submissions: savedSubmission._id }
    });

    return savedSubmission;
  }


  async findAll(task_id: string) {
    const taskWithSubmissions = await this.taskModel.findById(task_id).populate({
      path: 'submissions',
      model: 'Submission',
      populate: [{
        path: 'user_id',
        model: 'User'
      }]
    }).exec();

    if(!taskWithSubmissions){
      throw new NotFoundException('Task not found');
    }
    return taskWithSubmissions.submissions;
  }

  async findOne(task_id: string, submission_id: string) {
    const submission = await this.submissionModel
      .findOne({ _id: submission_id })
      .populate('user_id feedback')
      .exec();
  
    if (!submission) throw new NotFoundException('Submission not found');
    
    // Ensure the submission belongs to the given task
    const task = await this.taskModel.findById(task_id);
    if (!task || !task.submissions.includes(new Types.ObjectId(submission_id))) {
      throw new NotFoundException('Submission does not belong to the provided task');
    }
  
    return submission;
  }
  

  async remove(task_id: string, submission_id: string) {
    const submission = await this.submissionModel.findById(submission_id);
    if (!submission) throw new NotFoundException('Submission not found');
  
    // Ensure the submission belongs to the given task
    const task = await this.taskModel.findById(task_id);
    if (!task || !task.submissions.includes(new Types.ObjectId(submission_id))) {
      throw new NotFoundException('Submission does not belong to the provided task');
    }
    // Remove submission reference from the task
    await this.taskModel.findByIdAndUpdate(task_id, {
      $pull: { submissions: submission_id }
    });
  
    // Delete the submission
    return this.submissionModel.findByIdAndDelete(submission_id);
  }
  
}
