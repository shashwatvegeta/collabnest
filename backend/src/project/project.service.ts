import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('Project') private projectModel: Model<Project>) { }

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

    // Check if creator is a professor - if so, auto-approve the project
    let approvalStatus = 'pending';
    if (typeof createProjectDto.project_owner === 'object' &&
      createProjectDto.project_owner !== null) {
      // If the creator has a role field and is a PROFESSOR, set to approved
      if (createProjectDto.project_owner.user_type === 'professor') {
        approvalStatus = 'approved';
      }
    }

    const createdProject = new this.projectModel({
      ...createProjectDto,
      is_approved: approvalStatus,
      is_completed: false,
    });
    return createdProject.save();
  }

  async findAll() {
    return this.projectModel.find().exec();
  }

  async findOne(project_id: string) {
    const project = await this.projectModel.findOne({ _id: new Types.ObjectId(project_id) }).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${project_id} not found`);
    }
    return project;
  }

  update(project_id: string, updateProjectDto: UpdateProjectDto) {
    return this.projectModel
      .findOneAndUpdate({ _id: new Types.ObjectId(project_id) }, updateProjectDto, { new: true })
      .exec();
  }

  async remove(project_id: string) {
    const project = await this.projectModel.findOne({ _id: new Types.ObjectId(project_id) }).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${project_id} not found`);
    }
    if (project.students_enrolled && project.students_enrolled.length > 0) {
      throw new BadRequestException('Cannot delete project with enrolled students');
    }
    return this.projectModel.findOneAndDelete({ _id: new Types.ObjectId(project_id) }).exec();
  }

  // for students
  async getStudents(project_id: string): Promise<Types.ObjectId[] | null> {
    const project = await this.projectModel.findById(project_id).populate({
      path: 'students_enrolled',
      model: 'User',
    }).exec();

    return project ? project.students_enrolled : null;
  }

  async addStudent(project_id: string, student_id: string) {
    const project = await this.findOne(project_id);
    if (project.is_completed) {
      throw new BadRequestException('Cannot join a completed project');
    }
    if (project.students_enrolled && project.students_enrolled.length >= project.cap) {
      throw new BadRequestException('Project has reached maximum capacity');
    }
    if (Array.isArray(project.students_enrolled) && project.students_enrolled.some(
      student => student?._id?.toString() === student_id?.toString() || student?.toString() === student_id
    )) {
      throw new ConflictException('Student is already enrolled in this project');
    }
    return this.projectModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(project_id) },
        { $addToSet: { students_enrolled: student_id } },
        { new: true }
      )
      .exec();
  }

  async removeStudent(project_id: string, student_id: string) {
    return this.projectModel
      .findByIdAndUpdate(
        project_id,
        { $pull: { students_enrolled: student_id } },
        { new: true }
      )
      .exec();
  }

  async findByTaskId(task_id: string) { // used in submission service
    return this.projectModel.findOne({ tasks: task_id }).populate('owner').exec();
  }

  async updateApprovalStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
    return this.projectModel.findByIdAndUpdate(
      id,
      { is_approved: status },
      { new: true }
    ).exec();
  }

  async findPendingApprovals() {
    return this.projectModel.find({ is_approved: 'pending' }).exec();
  }

  async findApprovedProjects() {
    return this.projectModel.find({ is_approved: 'approved' }).exec();
  }
}