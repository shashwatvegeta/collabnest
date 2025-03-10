import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProjectApplicationController } from './user-project-application.controller';
import { UserProjectApplicationService } from './user-project-application.service';
import { ApplicationSchema } from '../application/application.schema';
import { ProjectSchema } from '../project/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Application', schema: ApplicationSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
  ],
  controllers: [UserProjectApplicationController],
  providers: [UserProjectApplicationService],
})
export class UserProjectApplicationModule {}