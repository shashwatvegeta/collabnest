import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserLevel extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  xp: number;

  @Prop({ default: 600 })
  nextLevelXp: number;
}

export const UserLevelSchema = SchemaFactory.createForClass(UserLevel);
export type UserLevelDocument = UserLevel & Document;