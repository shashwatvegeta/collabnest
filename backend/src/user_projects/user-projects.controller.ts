import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { UserProjectsService } from './user-projects.service';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { UpdateProjectDto } from '../project/dto/update-project.dto';
import { ProjectGuard } from 'src/guard/project.guard';
import { ProjectOwnerGuard } from 'src/guard/project-owner.guard';

@Controller('users/:user_id/projects')
export class UserProjectsController {
  constructor(private readonly userProjectsService: UserProjectsService) {}

  @Get()
  findAll(@Param('user_id') userId: string) {
    return this.userProjectsService.findAllForUser(userId);
  }

  @Get(':project_id')
  @UseGuards(ProjectGuard)
  findOne(@Param('user_id') userId: string, @Param('project_id') projectId: string) {
    return this.userProjectsService.findOneForUser(userId, +projectId);
  }

  @Post('add')
  create(@Param('user_id') userId: string, @Body() createProjectDto: CreateProjectDto) {
    return this.userProjectsService.createForUser(userId, createProjectDto);
  }

  @Delete(':pid')
  @UseGuards(ProjectOwnerGuard)
  remove(@Param('user_id') userId: string, @Param('pid') projectId: string) {
    return this.userProjectsService.removeForUser(userId, +projectId);
  }

  @Put(':pid')
  @UseGuards(ProjectOwnerGuard)
  update(
    @Param('user_id') userId: string,
    @Param('pid') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.userProjectsService.updateForUser(userId, +projectId, updateProjectDto);
  }
}