import { UserEntity } from '../user/user.entity';
import { FriendRequestStatus } from './friend-request-status.enum';

export interface FriendRequest {
  id?: number;
  status: FriendRequestStatus;
  creator: UserEntity;
  receiver: UserEntity;
}
