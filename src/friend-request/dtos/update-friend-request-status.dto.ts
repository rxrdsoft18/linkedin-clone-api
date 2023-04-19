import { FriendRequestStatus } from '../friend-request-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateFriendRequestStatusDto {
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
