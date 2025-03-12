import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user/user.schema"; // Import the User schema
@Schema()
export class Project extends Document {
  @Prop({ required: true })
  project_name: string;

  @Prop({ unique: true })  // remove _id: true, as it assigns `_id` by default
  project_id: number;
  @Prop()
  is_approved: boolean;
  @Prop()
  description: string;
  @Prop()
  is_completed: boolean;
  @Prop()
  cap: number;
  @Prop()
  start_date: Date;
  @Prop()
  end_date: Date;
  @Prop()
  discussion_threads: Object[];
  @Prop()
  tags: Object[];
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  project_owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })  // refrencing user for getting enrolled students
  students_enrolled: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }] })
  project_application: Types.ObjectId[];
}
export const ProjectSchema = SchemaFactory.createForClass(Project);