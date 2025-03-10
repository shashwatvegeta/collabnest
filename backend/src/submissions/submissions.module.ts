import { Module } from "@nestjs/common";
import { SubmissionsService } from "./submissions.service";
import { SubmissionsController } from "./submissions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { SubmissionSchema } from "./submissions.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Submission', schema: SubmissionSchema }]),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
