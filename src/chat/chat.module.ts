import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { ConversationEntity } from './entities/conversation.entity';
import { AuthModule } from '../auth/auth.module';
import { ConversationService } from './conversation.service';
import { ActiveConversationEntity } from './entities/active-conversation.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      MessageEntity,
      ConversationEntity,
      ActiveConversationEntity,
    ]),
  ],
  providers: [ChatService, ChatGateway, ConversationService],
})
export class ChatModule {}
