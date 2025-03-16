import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectService } from 'src/project/project.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class SubmissionGuard implements CanActivate {
    constructor(
        private readonly submissionsService: SubmissionsService,
        private readonly tasksService: TaskService,
        private readonly projectsService: ProjectService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assumes authentication is implemented
        const { task_id, submission_id } = request.params;

        // Fetch the task
        const task = await this.tasksService.findOne(task_id);
        if (!task) throw new NotFoundException('Task not found');

        // Fetch the submission
        const submission = await this.submissionsService.findOne(task_id, submission_id);
        if (!submission) throw new NotFoundException('Submission not found');

        // Ensure the submission belongs to the task
        if (!task.submissions.includes(submission_id)) {
            throw new NotFoundException('Submission does not belong to the provided task');
        }

        // Fetch the project that contains this task
        const project = await this.projectsService.findByTaskId(task_id);
        if (!project) throw new NotFoundException('Project not found');

        //  Allow access if the user is:
        // - The student who made the submission
        // - The professor/project owner who owns the project
        if (submission.user_id.toString() === user.id || project.project_owner.toString() === user.id) {
            return true;
        }

        throw new ForbiddenException('You do not have permission to access this submission');
    }
}
