import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { UserService } from '../user/user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FindOptionsDto } from './dtos/find-options.dto';

describe('FeedController', () => {
  let controller: FeedController;
  let service: FeedService;

  const mockRequest = {
    user: {
      id: 1,
      firstName: 'test',
      lastName: 'test',
      email: 'test@email.com',
      role: 'test',
    },
  };

  const mockFeedPost = {
    id: 1,
    body: 'body',
    createdAt: new Date(),
    author: null,
    updatedAt: new Date(),
  };

  const mockUpdateResult = {
    ...mockFeedPost,
    body: 'updated body',
  };

  const mockDeleteResult = {
    ...mockFeedPost,
  };

  const mockFeedPosts = [
    mockFeedPost,
    { ...mockFeedPost, body: 'second feed post' },
    { ...mockFeedPost, body: 'third feed post' },
  ];

  const mockFeedService = {
    findById: jest.fn(),
    create: jest.fn(),
    findPosts: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: IsCreatorGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(FeedService)
      .useValue(mockFeedService)
      .compile();

    service = moduleRef.get<FeedService>(FeedService);
    controller = moduleRef.get<FeedController>(FeedController);
  });

  it('should return feed by id', async () => {
    const result = {
      id: 1,
      body: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: null,
    };
    jest
      .spyOn(service, 'findById')
      .mockImplementation(() => Promise.resolve(result));
    expect(await controller.getFeedById(1)).toBe(result);
  });

  it('should create a feed post', async () => {
    const body = {
      body: 'test',
    };

    const mockRequest = {
      user: {
        id: 1,
        firstName: 'test',
        lastName: 'test',
        email: 'test@email.com',
        role: 'test',
      },
    };

    const createdFeedPost = {
      id: 1,
      body: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: null,
    };

    jest.spyOn(service, 'create').mockImplementation((data, user) => {
      return Promise.resolve(createdFeedPost);
    });

    expect(await controller.create(body, mockRequest)).toBe(createdFeedPost);
  });

  it('should get 2 feed posts, skipping the first', async () => {
    jest
      .spyOn(service, 'findPosts')
      .mockImplementation((options: FindOptionsDto) => {
        const feedPostsAfterSkipping = mockFeedPosts.slice(options.skip);
        return Promise.resolve(feedPostsAfterSkipping.slice(0, options.take));
      });
    expect(await controller.findSelected({ take: 2, skip: 1 })).toEqual(
      mockFeedPosts.slice(1),
    );
  });

  it('should update a feed post', async () => {
    jest.spyOn(service, 'update').mockImplementation(() => {
      return Promise.resolve(mockUpdateResult);
    });
    expect(await controller.update(1, { body: 'updated body' })).toEqual(
      mockUpdateResult,
    );
  });

  it('should delete a feed post', async () => {
    jest.spyOn(service, 'delete').mockImplementation(() => {
      return Promise.resolve(mockDeleteResult);
    });
    expect(await controller.delete(1)).toEqual(mockDeleteResult);
  });
});
