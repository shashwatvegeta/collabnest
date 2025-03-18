import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
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

  @Get('pending')
  findPendingApprovals() {
    return this.projectService.findPendingApprovals();
  }

  @Get('approved')
  findApprovedProjects() {
    return this.projectService.findApprovedProjects();
  }

  // @UseGuards(ProjectGuard)
  @Get(':project_id')
  findOne(@Param('project_id') project_id: string) {
    return this.projectService.findOne(project_id);
  }

  // @UseGuards(ProjectOwnerGuard)
  @Patch(':project_id')
  update(@Param('project_id') project_id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(project_id, updateProjectDto);
  }

  @Put(':project_id/approve')
  approveProject(@Param('project_id') project_id: string) {
    return this.projectService.updateApprovalStatus(project_id, 'approved');
  }

  @Put(':project_id/reject')
  rejectProject(@Param('project_id') project_id: string) {
    return this.projectService.updateApprovalStatus(project_id, 'rejected');
  }

  // @UseGuards(ProjectOwnerGuard)
  @Delete(':project_id')
  remove(@Param('project_id') project_id: string) {
    return this.projectService.remove(project_id);
  }
  
  // Get students of a project
  // @UseGuards(ProjectMemberGuard)
  @Get(':pid/students')
  getStudents(@Param('pid') project_id: string) {
    return this.projectService.getStudents(project_id);
  }

  // Add a student to a project
  // @UseGuards(ProjectOwnerGuard)
  @Post(':pid/students/:sid')
  addStudent(@Param('pid') project_id: string, @Param('sid') student_id: string) {
    return this.projectService.addStudent(project_id, student_id);
  }

  // Remove a student from a project
  // @UseGuards(ProjectOwnerGuard)
  @Delete(':pid/students/:sid')
  removeStudent(@Param('pid') project_id: string, @Param('sid') student_id: string) {
    return this.projectService.removeStudent(project_id, student_id);
  }
}