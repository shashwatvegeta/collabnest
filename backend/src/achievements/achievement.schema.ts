import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Achievement extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  achievement_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Skill' })
  skills_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Project' })
  projects_id: Types.ObjectId;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);