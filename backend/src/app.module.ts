import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchema } from "./project/project.schema";
import { ProjectModule } from "./project/project.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      //`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`,
      `mongodb+srv://Random:NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`,
    ),
    MongooseModule.forFeature([{ name: "Project", schema: ProjectSchema }]),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
