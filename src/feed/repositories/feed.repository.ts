import { BaseAbstractRepository } from '../../shared/repositories/base/base-abstract.repository';
import { FeedPostEntity } from '../entities/feed-post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class FeedRepository extends BaseAbstractRepository<FeedPostEntity> {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
  ) {
    super(feedPostRepository);
  }

  async getFeedPosts(take: number, skip: number) {
    return this.feedPostRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .orderBy('posts.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }
}
