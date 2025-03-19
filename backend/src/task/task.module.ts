import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task, TaskSchema } from './task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '../project/project.schema';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name: Task.name,
      schema: TaskSchema
    }]),
    MongooseModule.forFeature([{
      name: Project.name,
      schema: ProjectSchema
    }]),
    GamificationModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService]
})

export class TaskModule {}
