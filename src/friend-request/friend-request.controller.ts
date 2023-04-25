import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateFriendRequestStatusDto } from './dtos/update-friend-request-status.dto';
import { FriendRequestServiceInterface } from './interfaces/friend-request.service.interface';

@Controller('friend-request')
export class FriendRequestController {
  constructor(
    @Inject(FriendRequestService)
    private readonly friendRequestService: FriendRequestServiceInterface,
  ) {}

  @UseGuards(JwtGuard)
  @Post('send/:receiverId')
  async sendFriendRequest(@Param('receiverId') receiverId: number, @Req() req) {
    return this.friendRequestService.sendFriendRequest(receiverId, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('status/:receiverId')
  async statusFriendRequest(
    @Param('receiverId') receiverId: number,
    @Req() req,
  ) {
    return this.friendRequestService.getFriendRequestStatus(
      +receiverId,
      req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Patch('response/:friendRequestId')
  async responseFriendRequest(
    @Param('friendRequestId') friendRequestId: number,
    @Body(ValidationPipe) body: UpdateFriendRequestStatusDto,
  ) {
    return this.friendRequestService.respondToFriendRequest(
      friendRequestId,
      body.status,
    );
  }

  @UseGuards(JwtGuard)
  @Get('me/received-requests')
  async getFriendRequestsFromRecipients(@Req() req) {
    return this.friendRequestService.getFriendRequestsFromRecipients(
      req.user.id,
    );
  }

  @Get('friends/my')
  @UseGuards(JwtGuard)
  async getMyFriends(@Req() req) {
    return this.friendRequestService.getMyFriends(req.user.id);
  }
}
