import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('Project') private projectModel: Model<Project>) { }
  create(createProjectDto: CreateProjectDto) {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  findAll() {
    return this.projectModel.find().exec();
  }

  findOne(id: number) {
    return this.projectModel.findById(id).exec();
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectModel.findByIdAndUpdate(id, updateProjectDto, { new: true }).exec();
  }

  remove(id: number) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
