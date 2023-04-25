import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { NewUserDto } from './dtos/new-user.dto';
import * as fs from 'fs';
import { UserRepositoryInterface } from './interfaces/user.repository.interface';
import { UserServiceInterface } from './interfaces/user.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
    });
  }

  async findById(id: number) {
    return this.userRepository.findByCondition({
      where: { id },
      relations: ['feedPosts'],
    });
  }

  async doesUserExist(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  async create(user: Readonly<NewUserDto>) {
    const existingUser = await this.doesUserExist(user.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const userCreated = await this.userRepository.save(user);
    delete userCreated.password;
    return userCreated;
  }

  async updateUserImageById(id: number, imagePath: string) {
    const user = await this.userRepository.findByCondition({ where: { id } });
    user.imagePath = imagePath;
    return this.userRepository.save(user);
  }

  async findImageNameByUserId(id: number) {
    const user = await this.userRepository.findByCondition({ where: { id } });
    return user.imagePath;
  }

  async removeImageByImageName(id: number) {
    const oldImage = await this.findImageNameByUserId(id);
    if (fs.existsSync(`uploads/${oldImage}`)) {
      fs.unlinkSync(`uploads/${oldImage}`);
    }
  }
}
