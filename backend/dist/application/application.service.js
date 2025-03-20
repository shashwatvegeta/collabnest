"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("../project/project.schema");
const application_schema_1 = require("./application.schema");
const user_schema_1 = require("../user/user.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let ApplicationsService = class ApplicationsService {
    applicationModel;
    projectModel;
    userModel;
    notificationService;
    constructor(applicationModel, projectModel, userModel, notificationService) {
        this.applicationModel = applicationModel;
        this.projectModel = projectModel;
        this.userModel = userModel;
        this.notificationService = notificationService;
    }
    getHardcodedUserId() {
        return '67cde2e83c0958c938ef6210';
    }
    async create(createApplicationDto) {
        const user_id = createApplicationDto.user_id;
        const project = await this.projectModel.findById(createApplicationDto.project_id);
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${createApplicationDto.project_id} not found`);
        }
        if (new Date(Date.now()) > new Date(project.end_date)) {
            throw new Error(`Project end date has already passed`);
        }
        const user = await this.userModel.findById(user_id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const hasApplied = user.project_application.some(appId => project.project_application.includes(appId));
        if (hasApplied) {
            throw new Error(`User has already applied for this project`);
        }
        const createdApplication = new this.applicationModel({
            ...createApplicationDto,
            user_id: user_id
        });
        await createdApplication.save();
        await this.userModel.findByIdAndUpdate(user_id, {
            $push: { project_application: createdApplication._id },
        });
        await this.projectModel.findByIdAndUpdate(createApplicationDto.project_id, {
            $push: { project_application: createdApplication._id },
        });
        try {
            const receiverIds = [];
            if (project.project_owner) {
                receiverIds.push(project.project_owner.toString());
            }
            if (receiverIds.length > 0) {
                const studentName = user.username || 'A student';
                const projectName = project.project_name || 'your project';
                await this.notificationService.createNotification(user_id.toString(), receiverIds, `${studentName} has applied to join ${projectName}`);
                console.log(`Created notification for application to project ${project.project_name}`);
            }
        }
        catch (error) {
            console.error('Failed to create notification for application:', error);
        }
        const populatedApplication = await this.applicationModel
            .findById(createdApplication._id)
            .populate({
            path: 'user_id',
            model: 'User',
            select: 'username email roll_number'
        });
        if (!populatedApplication) {
            throw new common_1.NotFoundException(`Failed to find created application with ID ${createdApplication._id}`);
        }
        return populatedApplication;
    }
    async findAll(project_id) {
        try {
            const project = await this.projectModel
                .findById(project_id)
                .populate({
                path: 'project_application',
                model: 'Application',
                populate: {
                    path: 'user_id',
                    model: 'User',
                    select: 'username email roll_number'
                }
            });
            if (!project) {
                throw new common_1.NotFoundException(`Project with ID ${project_id} not found`);
            }
            console.log("Populated applications:", project.project_application);
            return project.project_application;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch applications for project ${project_id}\n${error.message}`);
        }
    }
    async findApplication(project_id, application_id) {
        try {
            const application = await this.applicationModel
                .findOne({ _id: application_id, project_id: new mongoose_2.Types.ObjectId(project_id) })
                .populate({
                path: 'user_id',
                model: 'User',
                select: 'username email roll_number'
            });
            if (!application) {
                throw new common_1.NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
            }
            return application;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch application: ${error.message}`);
        }
    }
    async updateApplication(project_id, application_id, updateApplicationDto) {
        try {
            const application = await this.applicationModel.findOne({
                _id: application_id,
                project_id: new mongoose_2.Types.ObjectId(project_id)
            }).populate('user_id');
            if (!application) {
                throw new common_1.NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
            }
            if (application.review_date) {
                throw new common_1.BadRequestException(`Application has already been reviewed on ${application.review_date}`);
            }
            if (updateApplicationDto.status === 'approved') {
                const project = await this.projectModel.findById(project_id);
                if (!project) {
                    throw new common_1.NotFoundException(`Project with ID ${project_id} not found`);
                }
                const isStudentEnrolled = project.students_enrolled.some(studentId => studentId.toString() === application.user_id._id.toString());
                if (!isStudentEnrolled) {
                    try {
                        await this.projectModel.findByIdAndUpdate(project_id, { $addToSet: { students_enrolled: application.user_id._id } });
                        const user = await this.userModel.findById(application.user_id._id);
                        if (!user) {
                            throw new common_1.NotFoundException(`User with ID ${application.user_id._id} not found`);
                        }
                        console.log("User before update:", user.username, "Projects:", user.projects);
                        const projectObjectId = new mongoose_2.Types.ObjectId(project_id);
                        const updateResult = await this.userModel.updateOne({ _id: application.user_id._id }, { $addToSet: { projects: projectObjectId } });
                        console.log("User update result:", updateResult);
                        const updatedUser = await this.userModel.findById(application.user_id._id);
                        if (!updatedUser) {
                            throw new common_1.NotFoundException(`User with ID ${application.user_id._id} not found after update`);
                        }
                        console.log("User after update:", updatedUser.username, "Projects:", updatedUser.projects);
                        if (updateResult.modifiedCount === 0) {
                            console.warn("User project array not updated, attempting alternative method");
                            user.projects.push(projectObjectId);
                            await user.save();
                            console.log("User saved directly, projects:", user.projects);
                        }
                        try {
                            const studentId = application.user_id._id.toString();
                            const projectDetails = await this.projectModel.findById(project_id);
                            if (projectDetails && projectDetails.project_owner) {
                                const projectName = projectDetails.project_name || 'the project';
                                await this.notificationService.createNotification(projectDetails.project_owner.toString(), [studentId], `Your application to join ${projectName} has been approved!`);
                            }
                        }
                        catch (error) {
                            console.error('Failed to create approval notification:', error);
                        }
                    }
                    catch (err) {
                        console.error("Error updating user or project:", err);
                        throw new Error(`Failed to update user or project: ${err.message}`);
                    }
                }
            }
            else if (updateApplicationDto.status === 'rejected') {
                try {
                    const studentId = application.user_id._id.toString();
                    const projectDetails = await this.projectModel.findById(project_id);
                    if (projectDetails && projectDetails.project_owner) {
                        const projectName = projectDetails.project_name || 'the project';
                        await this.notificationService.createNotification(projectDetails.project_owner.toString(), [studentId], `Your application to join ${projectName} was not accepted.`);
                    }
                }
                catch (error) {
                    console.error('Failed to create rejection notification:', error);
                }
            }
            const updatedApplication = await this.applicationModel.findByIdAndUpdate(application_id, { $set: updateApplicationDto }, { new: true, runValidators: true })
                .populate({
                path: 'user_id',
                model: 'User',
                select: 'username email roll_number'
            })
                .exec();
            if (!updatedApplication) {
                throw new common_1.NotFoundException(`Failed to update: Application with ID ${application_id} not found`);
            }
            return updatedApplication;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to update application: ${error.message}`);
        }
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationService])
], ApplicationsService);
//# sourceMappingURL=application.service.js.map