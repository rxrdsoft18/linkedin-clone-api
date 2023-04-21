import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeedPostEntity } from './entities/feed-post.entity';
import { RoleEnum } from '../user/role.enum';
import { FeedPost } from './interfaces/feed-post.interface';

describe('FeedService', () => {
  let service: FeedService;

  const mockRequest = {
    user: {
      id: 1,
      firstName: 'test',
      lastName: 'test',
      email: 'test@email.com',
      role: RoleEnum.USER,
      feedPosts: [],
    },
  };

  const createFeedPostDto = {
    body: 'body',
  };

  const mockCreatedResult = {
    ...createFeedPostDto,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: mockRequest.user,
  };

  const mockFeedPostRepository = {
    create: jest.fn().mockImplementation((dto, user) => {
      return {
        ...dto,
        author: user,
      };
    }),
    save: jest.fn().mockImplementation((feedPost: FeedPost) => {
      return Promise.resolve(mockCreatedResult);
    }),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: getRepositoryToken(FeedPostEntity),
          useValue: mockFeedPostRepository,
        },
      ],
    }).compile();
    service = moduleRef.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a feed post', async () => {
    const createdFeedPost = await service.create(
      createFeedPostDto,
      mockRequest.user,
    );
    expect(createdFeedPost).toEqual(mockCreatedResult);
  });
});
