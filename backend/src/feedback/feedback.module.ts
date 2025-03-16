import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/task/task.schema';
import { Project, ProjectSchema } from 'src/project/project.schema';
import { Feedback, FeedbackSchema } from './feedback.schema';
import { Submissions, SubmissionSchema } from 'src/submissions/submissions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Feedback.name,
      schema: FeedbackSchema
    }]),
    MongooseModule.forFeature([{
      name: Task.name,
      schema: TaskSchema
    }]),
    MongooseModule.forFeature([{
      name: Project.name,
      schema: ProjectSchema
    }]),
    MongooseModule.forFeature([{
      name: Submissions.name,
      schema: SubmissionSchema
    }]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule { }
