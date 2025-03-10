import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submissions } from './submissions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubmissionsService {
  constructor(@InjectModel('Submission') private submissionModel: Model<Submissions>) {}

  create(createSubmissionDto: CreateSubmissionDto) {
    const createdSubmission = new this.submissionModel(createSubmissionDto);
    return createdSubmission.save();
  }

  findAll() {
    return this.submissionModel.find().exec();
  }

  findOne(id: string) {
    return this.submissionModel.findById(id).exec();
  }

  remove(id: string) {
    return this.submissionModel.findByIdAndDelete(id).exec();
  }
}
