import { BaseInterfaceRepository } from '../../shared/repositories/base/base-interface.repository';
import { ConversationEntity } from '../entities/conversation.entity';

export interface ConversationRepositoryInterface
  extends BaseInterfaceRepository<ConversationEntity> {
  getConversation(
    creatorId: number,
    friendId: number,
  ): Promise<ConversationEntity>;
  getConversationsForUser(userId: number): Promise<ConversationEntity[]>;
  getUsersInConversation(conversationId: number): Promise<ConversationEntity>;
}
