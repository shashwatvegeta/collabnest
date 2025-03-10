import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema()

export class Discussion extends Document {
    @Prop({ required: true })
    title: string;
    @Prop({ _id: true })
    discussion_id: Object[];
    @Prop()
    Projects: Object[];
    @Prop()
    description: string;
    @Prop()
    created_by: Object[];
    @Prop()
    Discussion_Replies: Object[];

}
export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
