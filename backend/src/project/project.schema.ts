import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
@Schema()
export class Project extends Document {
  @Prop({ required: true })
  project_name: string;
  @Prop({ _id: true })
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
  @Prop()
  project_owner: number;
  @Prop()
  students_enrolled: Object[];
  @Prop([{ type: Types.ObjectId, ref: 'Task' }])
  tasks: Types.ObjectId[];
  @Prop([{ type: Types.ObjectId, ref: 'Application' }])
  project_application: Types.ObjectId[];
}
export const ProjectSchema = SchemaFactory.createForClass(Project);