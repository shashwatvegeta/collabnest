import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Project } from 'src/project/project.schema';
import { Application } from './application.schema';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectModel(Application.name) private applicationModel: Model<Application>,
        @InjectModel(Project.name) private projectModel: Model<Project>
    ) { }

    async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
        const project = await this.projectModel.findById(createApplicationDto.project_id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${createApplicationDto.project_id} not found`);
        }
        const createdApplication = new this.applicationModel(createApplicationDto);
        await this.projectModel.findByIdAndUpdate(
            createApplicationDto.project_id,
            { $push: { project_applications : createdApplication._id } }
        );
        return createdApplication.save();
    }

    async findAll(project_id: string): Promise<Application[]> {

        const project = await this.projectModel
            .findById(project_id)
            .populate<{ project_applications : Application[] }>({
                path: 'project_applications',
                model: 'Application' 
            });

        if (!project) {
            throw new NotFoundException(`Project with ID ${project_id} not found`);
        }

        return project.project_applications ; 
    }

    async findApplication( project_id: string, application_id: string ): Promise<Application> {

        const application = await this.applicationModel
            .findOne({ _id: application_id, project_id: new Types.ObjectId(project_id) })
            
        if (!application) {
            throw new NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
        }

        return application; 
    }

    async updateApplication( project_id: string, application_id: string, updateApplicationDto: UpdateApplicationDto ): Promise<Application> {


        // update Application only professor and mentor has right to update it
        // and also only few of the selected fields

        const application = await this.applicationModel.findOne({ 
            _id: application_id, 
            project_id: new Types.ObjectId(project_id) 
        });
    
        if (!application) {
            throw new NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
        }

        if (application.review_date) {
            throw new BadRequestException(`Application has already been reviewed on ${application.review_date}`);
        }

        const updatedApplication = await this.applicationModel.findByIdAndUpdate(
            application_id,
            { $set: updateApplicationDto },
            { new: true, runValidators: true }
        ).exec();
        
        if (!updatedApplication) {
            throw new NotFoundException(`Failed to update: Application with ID ${application_id} not found`);
        }
    
        return updatedApplication;
    }
}