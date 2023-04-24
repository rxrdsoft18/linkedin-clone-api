import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { ConversationEntity } from './entities/conversation.entity';
import { AuthModule } from '../auth/auth.module';
import { ConversationService } from './conversation.service';
import { ActiveConversationEntity } from './entities/active-conversation.entity';
import { FriendRequestModule } from '../friend-request/friend-request.module';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ActiveConversationRepository } from './repositories/active-conversation.repository';

@Module({
  imports: [
    AuthModule,
    FriendRequestModule,
    TypeOrmModule.forFeature([
      MessageEntity,
      ConversationEntity,
      ActiveConversationEntity,
    ]),
  ],
  providers: [
    ChatGateway,
    ConversationService,
    {
      provide: 'ConversationRepositoryInterface',
      useClass: ConversationRepository,
    },
    {
      provide: 'MessageRepositoryInterface',
      useClass: MessageRepository,
    },
    {
      provide: 'ActiveConversationRepositoryInterface',
      useClass: ActiveConversationRepository,
    },
  ],
})
export class ChatModule {}
