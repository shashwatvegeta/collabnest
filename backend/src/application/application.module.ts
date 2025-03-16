import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './application.schema';
import { Project, ProjectSchema } from 'src/project/project.schema';
import { ApplicationsService } from './application.service';
import { ApplicationsController } from './application.controller';
import { ProjectService } from 'src/project/project.service';
import { ProjectModule } from 'src/project/project.module';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Application.name,
      schema: ApplicationSchema
    }]),
    MongooseModule.forFeature([{
      name: Project.name,
      schema: ProjectSchema
    }]),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    ProjectModule
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController]
})
export class ApplicationModule { }
