import { ConversationInterface } from './conversation.interface';
import { UserInterface } from '../../user/interfaces/user.interface';

export interface MessageInterface {
  id?: number;
  message: string;
  user: UserInterface;
  conversation: ConversationInterface;
  createdAt?: Date;
}
