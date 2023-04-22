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
import { UserInterface } from '../user/user.interface';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly conversationService: ConversationService,
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
      await this.getConversationsByUserId(socket, user.id);
    }
    console.log(socket.handshake.headers, 'headers');
  }

  async getConversationsByUserId(socket: Socket, userId: number) {
    const conversations =
      await this.conversationService.getConversationsWithUsers(userId);
    console.log(conversations, 'conversations');
    this.server.to(socket.id).emit('conversations', conversations);
  }

  handleDisconnect(socket: Socket): any {
    console.log('disconnected');
  }

  @SubscribeMessage('createConversation')
  async createConversation(socket: Socket, friend: UserInterface) {
    await this.conversationService.createConversation(socket.data.user, friend);
    await this.getConversationsByUserId(socket, socket.data.user.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(socket: Socket, newMessage: NewMessageDto) {
    if (!newMessage || !newMessage.conversationId) {
      return;
    }
    const { user } = socket.data;
    const createdMessage = await this.conversationService.createMessage(
      newMessage,
      user,
    );

    console.log(createdMessage, 'createdMessage');

    this.server.emit('newMessage', newMessage);
  }
}
