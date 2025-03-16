import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    ForbiddenException
} from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
    constructor(private readonly projectsService: ProjectService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = request.params.id || request.params.project_id || request.params.pid;
        const taskId = request.params.task_id;
        let project;
        if (taskId) {
            // If task_id is provided, fetch project by task ID
            project = await this.projectsService.findByTaskId(taskId);
        } else if (projectId) {
            // If project_id is provided, fetch project directly
            project = await this.projectsService.findOne(projectId);
        } else {
            throw new NotFoundException('Project ID or Task ID not found in request parameters');
        }
        if (!project) throw new NotFoundException('Project not found');
        // Check if the user is the project owner
        if (project.project_owner.toString() === user.id) {
            return true;
        }
        throw new ForbiddenException('Only the project owner can access this resource');
    }
}
