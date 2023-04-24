import { UserEntity } from '../../user/entities/user.entity';

export interface FeedPost {
  id?: number;
  body?: string;
  author?: UserEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
