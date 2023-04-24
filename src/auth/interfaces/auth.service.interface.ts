import { UserEntity } from '../../user/entities/user.entity';
import { UserInterface } from '../../user/interfaces/user.interface';

export interface AuthServiceInterface {
  validateUser(email: string, pass: string): Promise<UserEntity | null>;
  login(user: any): Promise<{ token: string }>;
  register(user: any): Promise<UserEntity>;
  getJwtUser(token: string): Promise<UserInterface>;
  hashPassword(password: string): Promise<string>;
}
