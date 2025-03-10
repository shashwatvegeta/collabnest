import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchema } from "./project/project.schema";
import { ProjectModule } from "./project/project.module";
import { ApplicationModule } from "./application/application.module";
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      //`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`,
      `mongodb://localhost:27017/collabnest`,
    ),
    MongooseModule.forFeature([{ name: "Project", schema: ProjectSchema }]),
    ProjectModule,
    ApplicationModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
