import { ApplicationsService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    createApplication(project_id: string, createApplicationDto: CreateApplicationDto): Promise<import("./application.schema").Application>;
    getApplications(project_id: string): Promise<import("./application.schema").Application[]>;
    getApplication(project_id: string, application_id: string): Promise<import("./application.schema").Application>;
    updateApplication(project_id: string, application_id: string, updateApplicationDto: UpdateApplicationDto): Promise<import("./application.schema").Application>;
}
