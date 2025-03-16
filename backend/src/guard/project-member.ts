import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
    constructor(private readonly projectService: ProjectService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assumes authentication is implemented
        
        // Handle both direct project endpoints and task-related endpoints
        const projectId = request.params.id || request.params.project_id || request.params.pid;
        const taskId = request.params.task_id;
        let project;
        if (taskId) {
            project = await this.projectService.findByTaskId(taskId);
        } else if (projectId) {
            project = await this.projectService.findOne(projectId);
        } else {
            throw new NotFoundException('Project ID or Task ID not found in request parameters');
        }
        
        if (!project) throw new NotFoundException('Project not found');

        // Check if the user is the project owner or a member
        const isProjectOwner = project.project_owner.toString() === user.id;
        const isProjectMember = project.students_enrolled.some(member => member.toString() === user.id);

        if (isProjectOwner || isProjectMember) {
            return true;
        }

        throw new ForbiddenException('You are not a member of this project');
    }
}
