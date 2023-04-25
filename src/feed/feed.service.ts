import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedPostDto } from './dtos/create-feed-post.dto';
import { UpdateFeedPostDto } from './dtos/update-feed-post.dto';
import { FindOptionsDto } from './dtos/find-options.dto';
import { UserInterface } from '../user/interfaces/user.interface';
import { FeedRepositoryInterface } from './interfaces/feed.repository.interface';
import { FeedServiceInterface } from './interfaces/feed.service.interface';

@Injectable()
export class FeedService implements FeedServiceInterface {
  constructor(
    @Inject('FeedRepositoryInterface')
    private readonly feedPostRepository: FeedRepositoryInterface,
  ) {}

  findPosts(findOptions: FindOptionsDto) {
    const { take, skip } = findOptions;
    const takeValue = take > 20 ? 20 : take;
    return this.feedPostRepository.getFeedPosts(takeValue, skip);
  }

  async findById(id: number) {
    return this.feedPostRepository.findByCondition({
      where: { id },
      relations: ['author'],
    });
  }

  async create(
    createFeedPostDto: Readonly<CreateFeedPostDto>,
    user: UserInterface,
  ) {
    delete user.password;
    return this.feedPostRepository.save({ ...createFeedPostDto, author: user });
  }

  async update(id: number, updateFeedPostDto: UpdateFeedPostDto) {
    const post = await this.findById(id);
    post.body = updateFeedPostDto.body;
    return this.feedPostRepository.save(post);
  }

  async delete(id: number) {
    const post = await this.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.feedPostRepository.remove(post);
  }
}
