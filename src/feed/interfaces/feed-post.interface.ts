import { UserEntity } from '../../user/user.entity';

export interface FeedPost {
  id?: number;
  body?: string;
  author?: UserEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
