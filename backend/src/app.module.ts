import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchema } from "./project/project.schema";
import { ProjectModule } from "./project/project.module";
import { ApplicationModule } from "./application/application.module";
import { UserModule } from "./user/user.module";
import { ApplicationSchema } from "./application/application.schema";
import { AchievementSchema } from "./achievements/achievement.schema";
import { AchievementModule } from "./achievements/achievement.module";
import { CertificateModule } from "./certificates/certificate.module";
// import { User } from "./user/user.schema";

@Module({
  imports: [
    MongooseModule.forRoot(
      //`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`,
      `mongodb+srv://Random:NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`,
    ),
    MongooseModule.forFeature([{ name: "Project", schema: ProjectSchema }]),
    // MongooseModule.forFeature([{ name: "Achievement", schema: AchievementSchema }]),

    ProjectModule,
    ApplicationModule,
    UserModule,
    AchievementModule,
    CertificateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
