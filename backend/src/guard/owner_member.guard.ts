import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User should be attached via authentication middleware
    const projectId = request.params.project_id; // Extracting project ID from request params
    const taskId = request.params.task_id; // Extracting task ID (if available)

    if (!projectId) {
      throw new ForbiddenException('Project ID is required');
    }

    // Fetch project details using `ProjectService`
    const project = await this.projectService.findOne(projectId);

    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    // Check if the user is the project owner or enrolled
    const isProjectMember = 
      project.project_owner.toString() === user.id || 
      project.students_enrolled?.some(student => student.toString() === user.id);

    if (!isProjectMember) {
      throw new ForbiddenException('Access denied to project');
    }

    // If accessing a task, ensure it belongs to the project
    if (taskId) {
      const task = await this.taskService.findByProjectIdandTaskId(projectId, taskId);
      if (!task) {
        throw new ForbiddenException('Task not found or unauthorized');
      }
    }

    return true;
  }
}
