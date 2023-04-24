import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { ConversationService } from './conversation.service';
import { UserInterface } from '../user/interfaces/user.interface';
import { ActiveConversationInterface } from './interfaces/active-conversation.interface';
import { FriendRequestService } from '../friend-request/friend-request.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly conversationService: ConversationService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  @UseGuards(JwtGuard)
  async handleConnection(socket: Socket) {
    console.log('connected');

    const jwt = socket.handshake.headers.authorization || null;

    const user = await this.authService.getJwtUser(jwt);
    if (!user) {
      console.log('user not found');
      this.handleDisconnect(socket);
    } else {
      socket.data.user = user;

      await this.setActiveConversationUser(socket);

      await this.createConversations(socket, user.id);

      await this.getConversationsByUserId(socket, user.id);
    }
  }

  async createConversations(socket: Socket, userId: number) {
    const friends = await this.friendRequestService.getMyFriends(userId);
    for (const friend of friends) {
      await this.conversationService.createConversation(
        socket.data.user,
        friend,
      );
    }
  }

  async getConversationsByUserId(socket: Socket, userId: number) {
    const conversations =
      await this.conversationService.getConversationsWithUsers(userId);
    console.log(conversations, 'conversations');
    this.server.to(socket.id).emit('conversations', conversations);
  }

  async setActiveConversationUser(socket: Socket) {
    const { user } = socket.data;

    const activeConversation: ActiveConversationInterface = {
      socketId: socket.id,
      userId: user.id,
    };

    await this.conversationService.setActiveConversationUser(
      activeConversation,
    );
  }

  handleDisconnect(socket: Socket): any {
    console.log('disconnected');
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(socket: Socket, newMessage: NewMessageDto) {
    if (!newMessage) {
      return;
    }
    const { user } = socket.data;
    const createdMessage = await this.conversationService.createMessage(
      newMessage,
      user,
    );

    const friendId = createdMessage.conversation.users.find(
      (user) => user.id !== createdMessage.user.id,
    ).id;

    const friendSocketId =
      await this.conversationService.getActiveConversationUser(friendId);

    if (!friendSocketId) {
      return;
    }

    const { id, message, user: creator, conversation } = createdMessage;

    this.server.to(friendSocketId.socketId).emit('newMessage', {
      id,
      message,
      creatorId: creator.id,
      conversationId: conversation.id,
    });
  }
}
