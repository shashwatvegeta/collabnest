import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
   // Get students of a project
   @Get(':pid/students')
   getStudents(@Param('pid') projectId: string) {
     return this.projectService.getStudents(+projectId);
   }
 
   // Add a student to a project
   @Post(':pid/students/:sid')
   addStudent(@Param('pid') projectId: string, @Param('sid') studentId: string) {
     return this.projectService.addStudent(+projectId, studentId);
   }
 
   // Remove a student from a project
   @Delete(':pid/students/:sid')
   removeStudent(@Param('pid') projectId: string, @Param('sid') studentId: string) {
     return this.projectService.removeStudent(+projectId, studentId);
   }
}
