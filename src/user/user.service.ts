import { ConflictException, Injectable } from '@nestjs/common';
import { NewUserDto } from './dtos/new-user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
    });
  }

  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['feedPosts'],
    });
  }

  async create(user: Readonly<NewUserDto>) {
    const existingUser = await this.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const userCreated = await this.userRepository.save(user);
    delete userCreated.password;
    return userCreated;
  }

  async updateUserImageById(id: number, imagePath: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.imagePath = imagePath;
    return this.userRepository.save(user);
  }

  async findImageNameByUserId(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user.imagePath;
  }

  async removeImageByImageName(id: number) {
    const oldImage = await this.findImageNameByUserId(id);
    if (fs.existsSync(`uploads/${oldImage}`)) {
      fs.unlinkSync(`uploads/${oldImage}`);
    }
  }
}
