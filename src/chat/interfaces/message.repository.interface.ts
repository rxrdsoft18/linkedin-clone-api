import { BaseInterfaceRepository } from '../../shared/repositories/base/base-interface.repository';
import { MessageEntity } from '../entities/message.entity';

export type MessageRepositoryInterface = BaseInterfaceRepository<MessageEntity>;
