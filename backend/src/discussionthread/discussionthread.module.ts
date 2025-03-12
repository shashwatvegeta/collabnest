import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionThreadsController } from '../discussionthread/discussionthread.controller';
import { DiscussionThreadsService } from '../discussionthread/discussionthread.service';
import { DiscussionThread, DiscussionThreadSchema } from '../discussionthread/discussionthread.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DiscussionThread.name, schema: DiscussionThreadSchema }]),
  ],
  controllers: [DiscussionThreadsController],
  providers: [DiscussionThreadsService],
  exports: [DiscussionThreadsService],
})
export class DiscussionThreadModule { }