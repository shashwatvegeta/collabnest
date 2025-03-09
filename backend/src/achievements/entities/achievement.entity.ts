import { Types } from 'mongoose';

export class Achievement {
  achievement_id: string;
  skills_id: Types.ObjectId;
  projects_id: Types.ObjectId;
}