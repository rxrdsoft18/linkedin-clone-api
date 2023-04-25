import { ConversationEntity } from '../entities/conversation.entity';
import { MessageEntity } from '../entities/message.entity';
import { NewMessageDto } from '../dtos/new-message.dto';
import { ActiveConversationInterface } from './active-conversation.interface';
import { UserInterface } from '../../user/interfaces/user.interface';

export interface ConversationServiceInterface {
  createConversation(
    user: UserInterface,
    friend: UserInterface,
  ): Promise<ConversationEntity>;
  getConversationsWithUsers(userId: number): Promise<ConversationEntity[]>;
  createMessage(
    newMessage: NewMessageDto,
    user: UserInterface,
  ): Promise<MessageEntity>;
  setActiveConversationUser(
    activeConversationInterface: ActiveConversationInterface,
  ): Promise<void>;
  getActiveConversationUser(
    userId: number,
  ): Promise<ActiveConversationInterface>;
}
