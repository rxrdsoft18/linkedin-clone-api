import { Inject, Injectable } from '@nestjs/common';
import { ConversationEntity } from './entities/conversation.entity';
import { UserInterface } from '../user/interfaces/user.interface';
import { ConversationInterface } from './interfaces/conversation.interface';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessageInterface } from './interfaces/message.interface';
import { ActiveConversationEntity } from './entities/active-conversation.entity';
import { ActiveConversationInterface } from './interfaces/active-conversation.interface';
import { ConversationRepositoryInterface } from './interfaces/conversation.repository.interface';
import { MessageRepositoryInterface } from './interfaces/message.repository.interface';
import { ActiveConversationRepositoryInterface } from './interfaces/active-conversation.repository.interface';

@Injectable()
export class ConversationService {
  constructor(
    @Inject('ConversationRepositoryInterface')
    private readonly conversationRepository: ConversationRepositoryInterface,
    @Inject('MessageRepositoryInterface')
    private readonly messageRepository: MessageRepositoryInterface,
    @Inject('ActiveConversationRepositoryInterface')
    private readonly activeConversationRepository: ActiveConversationRepositoryInterface,
  ) {}

  getConversation(
    creatorId: number,
    friendId: number,
  ): Promise<ConversationEntity> {
    return this.conversationRepository.getConversation(creatorId, friendId);
  }

  async createConversation(creator: UserInterface, friend: UserInterface) {
    const conversation = await this.getConversation(creator.id, friend.id);
    const doesConversationExist = !!conversation;
    if (!doesConversationExist) {
      const newConversation: ConversationInterface = {
        users: [creator, friend],
      };
      return await this.conversationRepository.save(newConversation);
    }

    return conversation;
  }

  getConversationsForUser(userId: number): Promise<ConversationEntity[]> {
    return this.conversationRepository.getConversationsForUser(userId);
  }

  getUsersInConversation(conversationId: number): Promise<ConversationEntity> {
    return this.conversationRepository.getUsersInConversation(conversationId);
  }
  async getConversationsWithUsers(userId: number) {
    const conversations = await this.getConversationsForUser(userId);

    console.log(conversations, 'getConversationsWithUsers');

    return await Promise.all(
      conversations.map(async (conversation) => {
        const result = await this.getUsersInConversation(conversation.id);
        console.log(result, 'result');
        return result;
      }),
    );
  }

  async createMessage(newMessage: NewMessageDto, user: UserInterface) {
    if (!user) return;

    const conversation = await this.conversationRepository.findByCondition({
      where: [{ id: newMessage.conversationId }],
      relations: ['users'],
    });

    if (!conversation) return;

    const message: MessageInterface = {
      message: newMessage.message,
      user,
      conversation,
    };
    return this.messageRepository.save(message);
  }

  async setActiveConversationUser(
    activeConversation: ActiveConversationInterface,
  ) {
    await this.activeConversationRepository.updateOrCreateActiveConversation(
      activeConversation,
    );
  }

  async getActiveConversationUser(
    userId: number,
  ): Promise<ActiveConversationEntity> {
    return this.activeConversationRepository.findByCondition({
      where: { userId },
    });
  }
}
