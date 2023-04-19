import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { FriendRequestService } from './friend-request.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateFriendRequestStatusDto } from "./dtos/update-friend-request-status.dto";

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

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
      receiverId,
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
}