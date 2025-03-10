import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Certificate extends Document {
  @Prop({ type: Types.ObjectId })
  certificate_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  submission_id: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ default: Date.now })
  generated_at: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);