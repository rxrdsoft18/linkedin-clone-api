import { BaseAbstractRepository } from '../../shared/repositories/base/base-abstract.repository';
import { ConversationEntity } from '../entities/conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ConversationRepository extends BaseAbstractRepository<ConversationEntity> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {
    super(conversationRepository);
  }
  async getConversation(
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

  getConversationsForUser(userId: number): Promise<ConversationEntity[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('conversation.lastUpdated', 'DESC')
      .getMany();
  }

  getUsersInConversation(conversationId: number): Promise<ConversationEntity> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.users', 'user')
      .where('conversation.id = :conversationId', { conversationId })
      .getOne();
  }
}
