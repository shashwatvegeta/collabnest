import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProjectsController } from './user-projects.controller';
import { UserProjectsService } from './user-projects.service';
import { ProjectSchema } from '../project/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
  ],
  controllers: [UserProjectsController],
  providers: [UserProjectsService],
})
export class UserProjectsModule {}