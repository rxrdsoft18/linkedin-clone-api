import { ActiveConversationEntity } from '../entities/active-conversation.entity';
import { BaseInterfaceRepository } from '../../shared/repositories/base/base-interface.repository';
import { ActiveConversationInterface } from './active-conversation.interface';

export interface ActiveConversationRepositoryInterface
  extends BaseInterfaceRepository<ActiveConversationEntity> {
  updateOrCreateActiveConversation(
    activeConversation: ActiveConversationInterface,
  ): Promise<void>;
}
