import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    ForbiddenException
} from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class ProjectGuard implements CanActivate {
    constructor(private readonly projectsService: ProjectService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assumes authentication is implemented
        const projectId = request.params.id || request.params.project_id || request.params.pid;
        if (!projectId) {
            throw new NotFoundException('Project ID not found in request parameters');
        }
        // Fetch the project
        const project = await this.projectsService.findOne(projectId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        // Check if the user is the project owner or a member
        const isOwner = project.project_owner.toString() === user.id;
        const isMember = project.students_enrolled.some(
            student => student.toString() === user.id
        );
        // Allow access if the user is the owner or a member
        if (isOwner || isMember) {
            return true;
        }
        throw new ForbiddenException('You do not have permission to access this project');
    }
} 