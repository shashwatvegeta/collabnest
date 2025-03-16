import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectGuard } from 'src/guard/project.guard';
import { ProjectOwnerGuard } from 'src/guard/project-owner.guard';
import { ProjectMemberGuard } from 'src/guard/project-member';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  // @UseGuards(ProjectGuard)
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  // @UseGuards(ProjectOwnerGuard)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(ProjectOwnerGuard)
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
  // Get students of a project
  @Get(':pid/students')
  @UseGuards(ProjectMemberGuard)
  getStudents(@Param('pid') projectId: string) {
    return this.projectService.getStudents(+projectId);
  }

  // Add a student to a project
  @Post(':pid/students/:sid')
  @UseGuards(ProjectOwnerGuard)
  addStudent(@Param('pid') projectId: string, @Param('sid') studentId: string) {
    return this.projectService.addStudent(+projectId, studentId);
  }

  // Remove a student from a project
  @Delete(':pid/students/:sid')
  @UseGuards(ProjectOwnerGuard)
  removeStudent(@Param('pid') projectId: string, @Param('sid') studentId: string) {
    return this.projectService.removeStudent(+projectId, studentId);
  }
}
