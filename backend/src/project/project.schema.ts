import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user/user.schema"; // Import the User schema
@Schema()
export class Project extends Document {
  @Prop({ unique: true, default: () => new Types.ObjectId() }) 
  project_id: Types.ObjectId;
  @Prop({ required: true , minlength: 3, maxlength:100})
  project_name: string;
  @Prop({ default: 'pending'})
  is_approved: string;
  @Prop({ required:true , minlength:10 , maxlength:1000})
  description: string;
  @Prop({ default:false})
  is_completed: boolean;
  @Prop({ required:true , min:1 })
  cap: number;
  @Prop({ required: true})
  start_date: Date;
  @Prop({ required: true})
  end_date: Date;
  @Prop()
  discussion_threads: Object[];
  @Prop()
  tags: Object[];
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  project_owner: Types.ObjectId;
  
  @Prop({ type: String })
  mentor_email: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })  // refrencing user for getting enrolled students
  students_enrolled: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }] })
  project_application: Types.ObjectId[];
}
export const ProjectSchema = SchemaFactory.createForClass(Project);