import { Model } from 'mongoose';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Project } from 'src/project/project.schema';
import { Application } from './application.schema';
export declare class ApplicationsService {
    private applicationModel;
    private projectModel;
    constructor(applicationModel: Model<Application>, projectModel: Model<Project>);
    create(createApplicationDto: CreateApplicationDto): Promise<Application>;
    findAll(project_id: string): Promise<Application[]>;
    findApplication(project_id: string, application_id: string): Promise<Application>;
    updateApplication(project_id: string, application_id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application>;
}
