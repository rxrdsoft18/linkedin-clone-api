import { BaseAbstractRepository } from '../../shared/repositories/base/base-abstract.repository';
import { ActiveConversationEntity } from '../entities/active-conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveConversationInterface } from '../interfaces/active-conversation.interface';

export class ActiveConversationRepository extends BaseAbstractRepository<ActiveConversationEntity> {
  constructor(
    @InjectRepository(ActiveConversationEntity)
    private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
  ) {
    super(activeConversationRepository);
  }

  async updateOrCreateActiveConversation(
    activeConversation: ActiveConversationInterface,
  ): Promise<void> {
    await this.activeConversationRepository.upsert(
      [activeConversation],
      ['userId'],
    );
  }
}
