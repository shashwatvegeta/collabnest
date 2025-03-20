import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Project } from 'src/project/project.schema';
import { Application } from './application.schema';
import { User } from 'src/user/user.schema';
import { NotificationService } from 'src/notifications/notifications.service';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectModel(Application.name) private applicationModel: Model<Application>,
        @InjectModel(Project.name) private projectModel: Model<Project>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly notificationService: NotificationService
    ) { }

    // Function to return a hardcoded user_id (Replace this when auth is ready)
    private getHardcodedUserId(): string {
        return '67cde2e83c0958c938ef6210';
        // return '67cbd709f08fb1b143c0b7da'; // Replace with a valid ObjectId from your database
    }

    // a guard for students to apply
    // check if the applying user has a application_id that is already their in the projects
    // applications array
    async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
        const user_id = createApplicationDto.user_id;
        
        // Fetch project details
        const project = await this.projectModel.findById(createApplicationDto.project_id);
        if (!project) {
            throw new NotFoundException(`Project with ID ${createApplicationDto.project_id} not found`);
        }

        // Check if the project's end date has passed
        if (new Date(Date.now()) > new Date(project.end_date)) {
            throw new Error(`Project end date has already passed`);
        }

        // Fetch user details
        const user = await this.userModel.findById(user_id);
        if (!user) {
            throw new NotFoundException(`User with ID ${user_id} not found`);
        }

        // Check if the user has already applied for this project
        const hasApplied = user.project_application.some(appId =>
            project.project_application.includes(appId)
        );

        if (hasApplied) {
            throw new Error(`User has already applied for this project`);
        }

        // Create new application
        const createdApplication = new this.applicationModel({
            ...createApplicationDto,
            user_id: user_id // user_id is already an ObjectId from the DTO validation
        });

        // Save the application first
        await createdApplication.save();

        // Update user's project applications array
        await this.userModel.findByIdAndUpdate(user_id, {
            $push: { project_application: createdApplication._id },
        });

        // Update project's applications array
        await this.projectModel.findByIdAndUpdate(createApplicationDto.project_id, {
            $push: { project_application: createdApplication._id },
        });

        // Create notification for the project owner/mentor
        try {
            const receiverIds: string[] = [];
            
            // Add the project owner if it exists
            if (project.project_owner) {
                receiverIds.push(project.project_owner.toString());
            }
            
            // Let's make sure we have at least one recipient for the notification
            if (receiverIds.length > 0) {
                // Get the student's name for the notification
                const studentName = user.username || 'A student';
                const projectName = project.project_name || 'your project';
                
                await this.notificationService.createNotification(
                    user_id.toString(),
                    receiverIds,
                    `${studentName} has applied to join ${projectName}`
                );
                
                console.log(`Created notification for application to project ${project.project_name}`);
            }
        } catch (error) {
            // Don't fail the application if notification creation fails
            console.error('Failed to create notification for application:', error);
        }

        // Populate the user data before returning
        const populatedApplication = await this.applicationModel
            .findById(createdApplication._id)
            .populate({
                path: 'user_id',
                model: 'User',
                select: 'username email roll_number'
            });

        if (!populatedApplication) {
            throw new NotFoundException(`Failed to find created application with ID ${createdApplication._id}`);
        }

        return populatedApplication;
    }

    // for mentors/professors
    async findAll(project_id: string): Promise<Application[]> {
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
                throw new NotFoundException(`Project with ID ${project_id} not found`);
            }

            console.log("Populated applications:", project.project_application);
            return project.project_application as unknown as Application[];
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch applications for project ${project_id}\n${error.message}`);
        }
    }

    // for mentors/professors (owner only)
    async findApplication(project_id: string, application_id: string): Promise<Application> {
        try {
            const application = await this.applicationModel
                .findOne({ _id: application_id, project_id: new Types.ObjectId(project_id) })
                .populate({
                    path: 'user_id',
                    model: 'User',
                    select: 'username email roll_number'
                });

            if (!application) {
                throw new NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
            }

            return application;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch application: ${error.message}`);
        }
    }

    // for mentors/professors (owner only)
    async updateApplication(project_id: string, application_id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
        try {
            // update Application only professor and mentor has right to update it
            // and also only few of the selected fields

            const application = await this.applicationModel.findOne({
                _id: application_id,
                project_id: new Types.ObjectId(project_id)
            }).populate('user_id');

            if (!application) {
                throw new NotFoundException(`Application with project ID ${project_id} and application ID ${application_id} not found`);
            }

            if (application.review_date) {
                throw new BadRequestException(`Application has already been reviewed on ${application.review_date}`);
            }

            // If the application is being approved, add the student to the project's enrolled students
            if (updateApplicationDto.status === 'approved') {
                // Check if the project exists
                const project = await this.projectModel.findById(project_id);
                if (!project) {
                    throw new NotFoundException(`Project with ID ${project_id} not found`);
                }
                
                // Check if the student is already enrolled
                const isStudentEnrolled = project.students_enrolled.some(
                    studentId => studentId.toString() === application.user_id._id.toString()
                );
                
                if (!isStudentEnrolled) {
                    try {
                        // Add student to enrolled students
                        await this.projectModel.findByIdAndUpdate(
                            project_id,
                            { $addToSet: { students_enrolled: application.user_id._id } }
                        );
                        
                        // Get the user document to verify current projects
                        const user = await this.userModel.findById(application.user_id._id);
                        if (!user) {
                            throw new NotFoundException(`User with ID ${application.user_id._id} not found`);
                        }
                        console.log("User before update:", user.username, "Projects:", user.projects);
                        
                        // Also add project to user's projects using explicit method
                        const projectObjectId = new Types.ObjectId(project_id);
                        const updateResult = await this.userModel.updateOne(
                            { _id: application.user_id._id },
                            { $addToSet: { projects: projectObjectId } }
                        );
                        console.log("User update result:", updateResult);
                        
                        // Verify the update
                        const updatedUser = await this.userModel.findById(application.user_id._id);
                        if (!updatedUser) {
                            throw new NotFoundException(`User with ID ${application.user_id._id} not found after update`);
                        }
                        console.log("User after update:", updatedUser.username, "Projects:", updatedUser.projects);
                        
                        if (updateResult.modifiedCount === 0) {
                            console.warn("User project array not updated, attempting alternative method");
                            // Alternative approach - direct array push
                            user.projects.push(projectObjectId);
                            await user.save();
                            console.log("User saved directly, projects:", user.projects);
                        }
                        
                        // Send notification to student about application approval
                        try {
                            const studentId = application.user_id._id.toString();
                            const projectDetails = await this.projectModel.findById(project_id);
                            
                            if (projectDetails && projectDetails.project_owner) {
                                const projectName = projectDetails.project_name || 'the project';
                                
                                await this.notificationService.createNotification(
                                    projectDetails.project_owner.toString(),
                                    [studentId],
                                    `Your application to join ${projectName} has been approved!`
                                );
                            }
                        } catch (error) {
                            console.error('Failed to create approval notification:', error);
                        }
                    } catch (err) {
                        console.error("Error updating user or project:", err);
                        throw new Error(`Failed to update user or project: ${err.message}`);
                    }
                }
            } else if (updateApplicationDto.status === 'rejected') {
                // Send notification to student about application rejection
                try {
                    const studentId = application.user_id._id.toString();
                    const projectDetails = await this.projectModel.findById(project_id);
                    
                    if (projectDetails && projectDetails.project_owner) {
                        const projectName = projectDetails.project_name || 'the project';
                        
                        await this.notificationService.createNotification(
                            projectDetails.project_owner.toString(),
                            [studentId],
                            `Your application to join ${projectName} was not accepted.`
                        );
                    }
                } catch (error) {
                    console.error('Failed to create rejection notification:', error);
                }
            }

            const updatedApplication = await this.applicationModel.findByIdAndUpdate(
                application_id,
                { $set: updateApplicationDto },
                { new: true, runValidators: true }
            )
            .populate({
                path: 'user_id',
                model: 'User',
                select: 'username email roll_number'
            })
            .exec();

            if (!updatedApplication) {
                throw new NotFoundException(`Failed to update: Application with ID ${application_id} not found`);
            }

            return updatedApplication;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to update application: ${error.message}`);
        }
    }
}