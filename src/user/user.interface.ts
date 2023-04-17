import { FeedPostEntity } from '../feed/entities/feed-post.entity';
import { RoleEnum } from './role.enum';

export interface UserInterface {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: RoleEnum;
  feedPosts: FeedPostEntity[];
}
