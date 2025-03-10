import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { UserProjectApplicationService } from './user-project-application.service';
import { UpdateApplicationDto } from '../application/dto/update-application.dto';

@Controller('users/:user_id')
export class UserProjectApplicationController {
  constructor(private readonly userProjectApplicationService: UserProjectApplicationService) {}

  @Get('project-applications')
  findAll(@Param('user_id') userId: string) {
    return this.userProjectApplicationService.findAllForUser(userId);
  }

  @Get('project-applications/:application_id')
  findOne(@Param('user_id') userId: string, @Param('application_id') applicationId: string) {
    return this.userProjectApplicationService.findOneForUser(userId, applicationId);
  }

  @Put('projects/:pid/project-applications/:application_id')
  update(
    @Param('user_id') userId: string,
    @Param('pid') projectId: string,
    @Param('application_id') applicationId: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.userProjectApplicationService.updateApplicationStatus(
      userId, 
      projectId, 
      applicationId, 
      updateApplicationDto
    );
  }
}