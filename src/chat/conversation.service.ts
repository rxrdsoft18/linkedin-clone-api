import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { UserInterface } from '../user/user.interface';
import { ConversationInterface } from './interfaces/conversation.interface';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessageInterface } from './interfaces/message.interface';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  getConversation(
    creatorId: number,
    friendId: number,
  ): Promise<ConversationEntity> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :creatorId', { creatorId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne();
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
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('conversation.lastUpdated', 'DESC')
      .getMany();
  }

  getUsersInConversation(
    conversationId: number,
  ): Promise<ConversationEntity[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.users', 'user')
      .where('conversation.id = :conversationId', { conversationId })
      .getMany();
  }
  async getConversationsWithUsers(userId: number) {
    const conversations = await this.getConversationsForUser(userId);

    console.log(conversations, 'getConversationsWithUsers');

    return (
      await Promise.all(
        conversations.map(async (conversation) => {
          return await this.getUsersInConversation(conversation.id);
        }),
      )
    ).flat();
  }

  async createMessage(newMessage: NewMessageDto, user: UserInterface) {
    if (!user) return;

    const conversation = await this.conversationRepository.findOne({
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
}
