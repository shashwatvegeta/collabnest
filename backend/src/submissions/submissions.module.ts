import { Module } from "@nestjs/common";
import { SubmissionsService } from "./submissions.service";
import { SubmissionsController } from "./submissions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { SubmissionSchema } from "./submissions.schema";
import { TaskSchema } from "src/task/task.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Submission', schema: SubmissionSchema }]),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
