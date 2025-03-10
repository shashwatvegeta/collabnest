import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { Application } from '../application/application.schema';
import { Project } from '../project/project.schema';
import { UpdateApplicationDto } from '../application/dto/update-application.dto';

@Injectable()
export class UserProjectApplicationService {
  constructor(
    @InjectModel('Application') private applicationModel: Model<Application>,
    @InjectModel('Project') private projectModel: Model<Project>,
  ) {}

  async findAllForUser(userId: string) {
    // Find all applications submitted by this user
    return this.applicationModel.find({ applicant: userId }).exec();
  }

  async findOneForUser(userId: string, applicationId: string) {
    return this.applicationModel.findOne({
      _id: applicationId,
      applicant: userId
    }).exec();
  }

  async updateApplicationStatus(
    userId: string,
    projectId: string,
    applicationId: string,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    // First, check if the user has permission to approve/reject applications for this project
    const project = await this.projectModel.findOne({
      project_id: projectId,
      project_owner: userId,
    }).exec();

    if (!project) {
      throw new ForbiddenException('You do not have permission to manage applications for this project');
    }

    // Find the application
    const application = await this.applicationModel.findById(applicationId).exec();
    
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Use string comparison to avoid type issues
    // Use type assertions to help TypeScript understand the types
    const projectId1 = (project as any)._id?.toString();
    const projectId2 = (application as any).project?.toString();

    // If either ID is undefined, they can't match
    if (!projectId1 || !projectId2 || projectId1 !== projectId2) {
      throw new ForbiddenException('Application does not belong to this project');
    }

    // Update the application status
    return this.applicationModel.findByIdAndUpdate(
      applicationId,
      updateApplicationDto,
      { new: true }
    ).exec();
  }
}