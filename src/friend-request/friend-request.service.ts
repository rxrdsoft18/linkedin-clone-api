import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { UserService } from '../user/user.service';
import { FriendRequestStatus } from './friend-request-status.enum';
import { FriendRequestRepositoryInterface } from './interfaces/friend-request.repository.interface';
import { UserServiceInterface } from '../user/interfaces/user.service.interface';
import { FriendRequestServiceInterface } from './interfaces/friend-request.service.interface';

@Injectable()
export class FriendRequestService implements FriendRequestServiceInterface {
  constructor(
    @Inject('FriendRequestRepositoryInterface')
    private readonly friendRequestRepository: FriendRequestRepositoryInterface,
    @Inject(UserService)
    private readonly userService: UserServiceInterface,
  ) {}

  async getFriendRequestStatus(receiverId: number, creatorId: number) {
    if (receiverId === creatorId) {
      throw new BadRequestException(
        'You cannot get the status of a friend request to yourself',
      );
    }

    const friendRequest = await this.friendRequestRepository.findByCondition({
      where: [
        { creator: { id: creatorId }, receiver: { id: receiverId } },
        { creator: { id: receiverId }, receiver: { id: creatorId } },
      ],
      relations: ['receiver', 'creator'],
    });

    if (!friendRequest) {
      return { status: FriendRequestStatus.NOT_SENT };
    }

    if (friendRequest?.receiver.id === creatorId) {
      return { status: FriendRequestStatus.WAITING_CURRENT_USER_RESPONSE };
    }

    return { status: friendRequest.status };
  }

  async hasRequestBeenSentOrReceived(creatorId: number, receiverId: number) {
    return this.friendRequestRepository.findByCondition({
      where: [
        { creator: { id: creatorId }, receiver: { id: receiverId } },
        { creator: { id: receiverId }, receiver: { id: creatorId } },
      ],
    });
  }

  async sendFriendRequest(receiverId: number, creatorId: number) {
    if (receiverId === creatorId) {
      throw new BadRequestException(
        'You cannot send a friend request to yourself',
      );
    }

    const receiver = await this.userService.findById(receiverId);
    const creator = await this.userService.findById(creatorId);

    const request = await this.hasRequestBeenSentOrReceived(
      creator.id,
      receiver.id,
    );

    if (request) {
      throw new BadRequestException('Friend request already sent');
    }

    return this.friendRequestRepository.save({ receiver, creator });
  }

  async getFriendRequestById(id: number) {
    return this.friendRequestRepository.findByCondition({
      where: { id },
    });
  }

  async respondToFriendRequest(
    friendRequestId: number,
    status: FriendRequestStatus,
  ) {
    const friendRequest = await this.getFriendRequestById(friendRequestId);

    if (!friendRequest) {
      throw new BadRequestException('Friend request not found');
    }

    return this.friendRequestRepository.save({
      ...friendRequest,
      status,
    });
  }

  async getFriendRequestsFromRecipients(currentUserId: number) {
    return this.friendRequestRepository.findAll({
      where: [{ receiver: { id: currentUserId } }],
      relations: ['receiver', 'creator'],
    });
  }

  async getMyFriends(currentUserId: number) {
    const friends = await this.friendRequestRepository.findAll({
      where: [
        {
          receiver: { id: currentUserId },
          status: FriendRequestStatus.ACCEPTED,
        },
        {
          creator: { id: currentUserId },
          status: FriendRequestStatus.ACCEPTED,
        },
      ],
      relations: ['receiver', 'creator'],
    });

    return friends.map((friend) => this.getFriend(friend, currentUserId));
  }

  private getFriend(friend: FriendRequestEntity, currentUserId: number) {
    if (friend.creator.id === currentUserId) {
      return friend.receiver;
    }
    return friend.creator;
  }
}
