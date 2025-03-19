import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../project/project.schema';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { UpdateProjectDto } from '../project/dto/update-project.dto';

@Injectable()
export class UserProjectsService {
  constructor(@InjectModel('Project') private projectModel: Model<Project>) {}

  async findAllForUser(userId: string) {
    return this.projectModel.find({ project_owner: userId }).exec();
  }

  async findOneForUser(userId: string, projectId: number) {
    return this.projectModel.findOne({
      project_id: projectId,
      project_owner: userId,
    }).exec();
  }

  async createForUser(userId: string, createProjectDto: CreateProjectDto) {
    const projectData = {
      ...createProjectDto,
      project_owner: userId,
      is_approved: 'pending',
      is_completed: false,
      discussion_threads: [],
      tags: [],
      students_enrolled: [],
      tasks: [],
      project_application: [],
    };
    
    const createdProject = new this.projectModel(projectData);
    return createdProject.save();
  }

  async updateForUser(userId: string, projectId: number, updateProjectDto: UpdateProjectDto) {
    return this.projectModel.findOneAndUpdate(
      { project_id: projectId, project_owner: userId },
      updateProjectDto,
      { new: true }
    ).exec();
  }

  async removeForUser(userId: string, projectId: number) {
    return this.projectModel.findOneAndDelete({
      project_id: projectId,
      project_owner: userId,
    }).exec();
  }
}