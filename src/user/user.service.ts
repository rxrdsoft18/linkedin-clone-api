import { ConflictException, Injectable } from '@nestjs/common';
import { NewUserDto } from './dtos/new-user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
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
}
