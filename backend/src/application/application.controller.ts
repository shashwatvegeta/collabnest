import { BadRequestException, Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApplicationsService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ProjectOwnerGuard } from 'src/guard/project-owner.guard';

@Controller('projects')
export class ApplicationsController {

    constructor(private readonly applicationsService: ApplicationsService) { }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('/:project_id/apply')
    async createApplication(
        @Param('project_id') project_id: string,
        @Body() createApplicationDto: CreateApplicationDto
    ) {
        if (!Types.ObjectId.isValid(project_id)) {
            throw new BadRequestException('Invalid project_id');
        }

        createApplicationDto.project_id = new Types.ObjectId(project_id);

        return this.applicationsService.create(createApplicationDto);
    }

    // @UseGuards(ProjectOwnerGuard) 
    @Get('/:project_id/applications')
    getApplications(@Param('project_id') project_id: string) {

        if (!Types.ObjectId.isValid(project_id)) {
            throw new BadRequestException('Invalid project_id');
        }

        return this.applicationsService.findAll(project_id);
    }

    @Get('/:project_id/applications/:application_id')
    getApplication(@Param('project_id') project_id: string, @Param('application_id') application_id: string) {
        if (!Types.ObjectId.isValid(project_id) || !Types.ObjectId.isValid(application_id)) {
            throw new BadRequestException('Invalid project_id or application_id');
        }

        return this.applicationsService.findApplication(project_id, application_id);
    }

    // Only project owner can review the applications
    // @UseGuards(ProjectOwnerGuard) 
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Put('/:project_id/applications/:application_id')
    updateApplication(
        @Param('project_id') project_id: string,
        @Param('application_id') application_id: string,
        @Body() updateApplicationDto: UpdateApplicationDto) {
        // mentor/ professor can update
        // reviewDate (can review once Only)
        // rejectionReason
        // approval_notes
        if(!updateApplicationDto) {
            throw new BadRequestException( "Dto cannot be empty." );
        }
        
        if ((updateApplicationDto.approval_notes && updateApplicationDto.rejection_reason) ||
            (!updateApplicationDto.approval_notes && !updateApplicationDto.rejection_reason)) {
            throw new BadRequestException("Either 'approval_notes' or 'rejection_reason' should be provided, but not both.");
        }

        updateApplicationDto.status = (updateApplicationDto.approval_notes) ? "approved" : "rejected";
        
        console.log(updateApplicationDto);

        return this.applicationsService.updateApplication(project_id, application_id, updateApplicationDto);

    }
}