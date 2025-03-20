import { Model } from 'mongoose';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Project } from 'src/project/project.schema';
import { Application } from './application.schema';
import { User } from 'src/user/user.schema';
import { NotificationService } from 'src/notifications/notifications.service';
export declare class ApplicationsService {
    private applicationModel;
    private projectModel;
    private userModel;
    private readonly notificationService;
    constructor(applicationModel: Model<Application>, projectModel: Model<Project>, userModel: Model<User>, notificationService: NotificationService);
    private getHardcodedUserId;
    create(createApplicationDto: CreateApplicationDto): Promise<Application>;
    findAll(project_id: string): Promise<Application[]>;
    findApplication(project_id: string, application_id: string): Promise<Application>;
    updateApplication(project_id: string, application_id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application>;
}
