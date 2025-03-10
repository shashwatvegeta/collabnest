import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionPostController } from './discussion.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { DiscussionSchema } from "./discussion.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Discussion", schema: DiscussionSchema }]),

  ],
  controllers: [DiscussionPostController],
  providers: [DiscussionService],
})
export class DiscussionModule { }

