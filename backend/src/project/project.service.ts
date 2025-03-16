import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('Project') private projectModel: Model<Project>) {}
  async create(createProjectDto: CreateProjectDto) {

    if (new Date(createProjectDto.start_date) >= new Date(createProjectDto.end_date)) {
      throw new BadRequestException('End date must be after start date');
    }
    const startDate = new Date(createProjectDto.start_date);
    startDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new BadRequestException('Start date must be today or in the future');
    }
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll() {
    return this.projectModel.find().exec();
  }
  async findOne(id: number) {
    const project = await this.projectModel.findOne({ project_id: id }).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectModel
      .findOneAndUpdate({ project_id: id }, updateProjectDto, { new: true })
      .exec();
  }
  
  async remove(id: number) {
    const project = await this.projectModel.findOne({ project_id: id }).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    if (project.students_enrolled && project.students_enrolled.length > 0) {
      throw new BadRequestException('Cannot delete project with enrolled students');
    }
    return this.projectModel.findOneAndDelete({ project_id: id }).exec();
  }

  // for students
  async getStudents(projectId: number): Promise<Types.ObjectId[] | null> {
    const project = await this.projectModel.findOne({ project_id: projectId }).exec(); 
    return project ? project.students_enrolled : null;
  }
  async addStudent(projectId: number, studentId: string) {
    const project = await this.findOne(projectId);
    if (project.is_completed) {
      throw new BadRequestException('Cannot join a completed project');
    }
    if (project.students_enrolled && project.students_enrolled.length >= project.cap) {
      throw new BadRequestException('Project has reached maximum capacity');
    }
    if (project.students_enrolled && project.students_enrolled.some(
      student => student._id.toString() === studentId || student.toString() === studentId
    )) {
      throw new ConflictException('Student is already enrolled in this project');
    }
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

  async findByTaskId(task_id: string) { // used in submission service
    return this.projectModel.findOne({ tasks: task_id }).populate('owner').exec();
  }  
}
