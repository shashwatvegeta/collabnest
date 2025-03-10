import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { DiscussionSchema } from "./discussion.schema";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Discussion", schema: DiscussionSchema }]),
  ],
  controllers: [DiscussionController],
  providers: [DiscussionService],
})
export class DiscussionModule { }

