import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchema } from "./project/project.schema";
import { ProjectModule } from "./project/project.module";
import { ApplicationModule } from "./application/application.module";
import { TaskModule } from './task/task.module';
import { UserModule } from "./user/user.module";
import { ApplicationSchema } from "./application/application.schema";
import { AchievementSchema } from "./achievements/achievement.schema";
import { AchievementModule } from "./achievements/achievement.module";
import { CertificateModule } from "./certificates/certificate.module";
import { SubmissionsModule } from './submissions/submissions.module';
import { SubmissionSchema } from "./submissions/submissions.schema";
import { DiscussionModule } from "./discussion/discussion.module";
import { DiscussionSchema } from "./discussion/discussion.schema";
// import { User } from "./user/user.schema";
import { DiscussionThreadModule } from './discussionthread/discussionthread.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NotificationsModule } from "./notifications/notifications.module";
import { MeetingModule } from "./meeting/meeting.module";

// import { NotificationModule } from "./admin_notification/admin_notification.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      //`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`,
      `mongodb+srv://Random:NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`,
      // `mongodb://localhost:27017/collabnest`
    ),
    MongooseModule.forFeature([{ name: "Project", schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: "Submissions", schema: SubmissionSchema }]),
    // MongooseModule.forFeature([{ name: "Achievement", schema: AchievementSchema }]),

    ProjectModule,
    DiscussionModule,
    ApplicationModule,
    TaskModule,
    UserModule,
    AchievementModule,
    CertificateModule,
    SubmissionsModule,
    DiscussionThreadModule,
    FeedbackModule,
    NotificationsModule,
    MeetingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }