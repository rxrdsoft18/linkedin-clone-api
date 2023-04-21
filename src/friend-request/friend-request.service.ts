import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendRequestEntity } from './friend-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { UserInterface } from '../user/user.interface';
import { FriendRequestStatus } from './friend-request-status.enum';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    private readonly userService: UserService,
  ) {}

  async getFriendRequestStatus(receiverId: number, creatorId: number) {
    if (receiverId === creatorId) {
      throw new BadRequestException(
        'You cannot get the status of a friend request to yourself',
      );
    }

    const friendRequest = await this.friendRequestRepository.findOne({
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
    return this.friendRequestRepository.findOne({
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
    return this.friendRequestRepository.findOne({
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
    return this.friendRequestRepository.find({
      where: [{ receiver: { id: currentUserId } }],
      relations: ['receiver', 'creator'],
    });
  }
}
