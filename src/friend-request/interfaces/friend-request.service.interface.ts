import { FriendRequestStatus } from '../friend-request-status.enum';
import { FriendRequest } from './friend-request.interface';
import { FriendRequestEntity } from "../entities/friend-request.entity";
import { UserEntity } from "../../user/entities/user.entity";

export interface FriendRequestServiceInterface {
  getFriendRequestStatus(
    receiverId: number,
    creatorId: number,
  ): Promise<{ status: FriendRequestStatus }>;
  hasRequestBeenSentOrReceived(
    creatorId: number,
    receiverId: number,
  ): Promise<FriendRequestEntity>;
  sendFriendRequest(
    receiverId: number,
    creatorId: number,
  ): Promise<FriendRequestEntity>;
  respondToFriendRequest(
    friendRequestId: number,
    status: FriendRequestStatus,
  ): Promise<FriendRequestEntity>;
  getFriendRequestsFromRecipients(
    currentUserId: number,
  ): Promise<FriendRequestEntity[]>;
  getFriendRequestById(id: number): Promise<FriendRequestEntity>;
  getMyFriends(currentUserId: number): Promise<UserEntity[]>;
}
