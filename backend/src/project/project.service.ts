import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('Project') private projectModel: Model<Project>) {}
  create(createProjectDto: CreateProjectDto) {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  findAll() {
    return this.projectModel.find().exec();
  }
  findOne(id: number) {
    return this.projectModel.findOne({ project_id: id }).exec();
  }
  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectModel
      .findOneAndUpdate({ project_id: id }, updateProjectDto, { new: true })
      .exec();
  }
  remove(id: number) {
    return this.projectModel.findOneAndDelete({ project_id: id }).exec();
  }

  // for students
  async getStudents(projectId: number): Promise<Object[] | null> {
    const project = await this.projectModel.findOne({ project_id: projectId }).exec(); 
    return project ? project.students_enrolled : null;
  }
  async addStudent(projectId: number, studentId: string) {
    return this.projectModel
      .findOneAndUpdate(
        { project_id: projectId },
        { $addToSet: { students_enrolled: studentId } },
        { new: true }
      )
      .exec();
  }
  async removeStudent(projectId: number, studentId: string) {
    return this.projectModel
      .findOneAndUpdate(
        { project_id: projectId },
        { $pull: { students_enrolled: studentId } },
        { new: true }
      )
      .exec();
  }
}
