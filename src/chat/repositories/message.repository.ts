import { BaseAbstractRepository } from '../../shared/repositories/base/base-abstract.repository';
import { MessageEntity } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class MessageRepository extends BaseAbstractRepository<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {
    super(messageRepository);
  }
}
