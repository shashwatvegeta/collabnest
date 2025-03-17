import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/task/task.schema';
import { Meeting, MeetingSchema } from './meeting.schema';
import { TaskService } from 'src/task/task.service';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name: Task.name,
      schema: TaskSchema
    }]),
    MongooseModule.forFeature([{
      name: Meeting.name,
      schema: MeetingSchema
    }]),
    TaskModule
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
