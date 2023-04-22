import { UserInterface } from '../../user/user.interface';

export interface ConversationInterface {
  id?: number;
  users?: UserInterface[];
  lastUpdated?: Date;
}
