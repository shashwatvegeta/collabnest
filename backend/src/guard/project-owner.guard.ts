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
        const { task_id } = request.params;

        // Fetch the project associated with the task
        const project = await this.projectsService.findByTaskId(task_id);
        if (!project) throw new NotFoundException('Project not found');

        // Check if the user is the project owner
        if (project.project_owner.toString() === user.id) {
            return true;
        }

        throw new ForbiddenException('Only the project owner can access this resource');
    }
}
