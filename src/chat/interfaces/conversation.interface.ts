import { UserInterface } from '../../user/interfaces/user.interface';

export interface ConversationInterface {
  id?: number;
  users?: UserInterface[];
  lastUpdated?: Date;
}
