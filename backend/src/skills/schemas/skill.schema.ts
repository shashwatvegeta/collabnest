import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Skill extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
export type SkillDocument = Skill & Document;
