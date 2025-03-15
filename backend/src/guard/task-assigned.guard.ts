import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class TaskAssignedGuard implements CanActivate {
    constructor(private readonly taskService: TaskService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assumes authentication is implemented
        const { task_id } = request.params;

        // Fetch the task
        const task = await this.taskService.findOne(task_id);
        if (!task) throw new NotFoundException('Task not found');

        // Check if the user is assigned to the task
        const isAssigned = task.assigned_to.some(assignedUser => assignedUser.toString() === user.id);

        if (isAssigned) {
            return true;
        }

        throw new ForbiddenException('You are not assigned to this task');
    }
}
