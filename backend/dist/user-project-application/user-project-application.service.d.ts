import { Model, Document } from 'mongoose';
import { Application } from '../application/application.schema';
import { Project } from '../project/project.schema';
import { UpdateApplicationDto } from '../application/dto/update-application.dto';
export declare class UserProjectApplicationService {
    private applicationModel;
    private projectModel;
    constructor(applicationModel: Model<Application>, projectModel: Model<Project>);
    findAllForUser(userId: string): Promise<(Document<unknown, {}, Application> & Application & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOneForUser(userId: string, applicationId: string): Promise<(Document<unknown, {}, Application> & Application & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateApplicationStatus(userId: string, projectId: string, applicationId: string, updateApplicationDto: UpdateApplicationDto): Promise<(Document<unknown, {}, Application> & Application & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
