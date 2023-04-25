import { UserEntity } from '../entities/user.entity';
import { NewUserDto } from '../dtos/new-user.dto';

export interface UserServiceInterface {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  doesUserExist(email: string): Promise<boolean>;
  create(user: Readonly<NewUserDto>): Promise<UserEntity>;
  updateUserImageById(id: number, imagePath: string): Promise<UserEntity>;
  findImageNameByUserId(id: number): Promise<string>;
  removeImageByImageName(id: number): Promise<void>;
}
