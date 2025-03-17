import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting } from './meeting.schema';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<Meeting>
  ) {}

  async createMeeting(meetingDto: any): Promise<Meeting> {
    const meeting = new this.meetingModel(meetingDto);
    return meeting.save();
  }

  async getMeetingById(meetingId: string): Promise<Meeting | null> {
    return this.meetingModel.findById(meetingId).exec();
  }
}