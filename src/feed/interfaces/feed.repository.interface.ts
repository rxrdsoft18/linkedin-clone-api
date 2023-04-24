import { BaseInterfaceRepository } from '../../shared/repositories/base/base-interface.repository';
import { FeedPostEntity } from '../entities/feed-post.entity';

export interface FeedRepositoryInterface
  extends BaseInterfaceRepository<FeedPostEntity> {
  getFeedPosts(take: number, skip: number): Promise<FeedPostEntity[]>;
}
