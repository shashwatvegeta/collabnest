import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserSkill extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  skillId: string;

  @Prop({ default: false })
  verified: boolean;
}

export const UserSkillSchema = SchemaFactory.createForClass(UserSkill);
export type UserSkillDocument = UserSkill & Document;