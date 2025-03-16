import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchema } from "./project.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Project", schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [MongooseModule, ProjectService]
})
export class ProjectModule { }
