import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionthreadService } from './discussionthread.service';

describe('DiscussionthreadService', () => {
  let service: DiscussionthreadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscussionthreadService],
    }).compile();

    service = module.get<DiscussionthreadService>(DiscussionthreadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
