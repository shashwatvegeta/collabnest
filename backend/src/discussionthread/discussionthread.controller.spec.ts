import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionthreadController } from './discussionthread.controller';
import { DiscussionthreadService } from './discussionthread.service';

describe('DiscussionthreadController', () => {
  let controller: DiscussionthreadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionthreadController],
      providers: [DiscussionthreadService],
    }).compile();

    controller = module.get<DiscussionthreadController>(DiscussionthreadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
