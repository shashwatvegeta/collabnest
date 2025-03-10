import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum UserType {
  STUDENT = 'student',
  MENTOR = 'mentor',
  PROFESSOR = 'professor',
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  roll_number: string;

  @Prop({ type: [{ type: Types.ObjectId }] })
  notifications: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }], required: true })
  projects: Types.ObjectId[];

  @Prop({ 
    required: true, 
    enum: [UserType.STUDENT, UserType.MENTOR, UserType.PROFESSOR],
    default: UserType.STUDENT 
  })
  user_type: string;

  @Prop({ type: [Object], required: true })
  student_skills: object[];

  @Prop({ type: [Object], required: true })
  certificates: object[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }], required: true })
  project_application: Types.ObjectId[];

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ type: [Object], required: true })
  achievements: object[];
}

export const UserSchema = SchemaFactory.createForClass(User);