import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedPostEntity } from './entities/feed-post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFeedPostDto } from './dtos/create-feed-post.dto';
import { UpdateFeedPostDto } from './dtos/update-feed-post.dto';
import { FindOptionsDto } from './dtos/find-options.dto';
import { UserInterface } from '../user/user.interface';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
  ) {}

  async findAll(findOptions: FindOptionsDto) {
    const { take, skip } = findOptions;
    const takeValue = take > 20 ? 20 : take;

    return this.feedPostRepository.find();
  }

  findPost(findOptions: FindOptionsDto) {
    const { take, skip } = findOptions;
    const takeValue = take > 20 ? 20 : take;
    // return this.feedPostRepository
    //   .findAndCount({ take: takeValue, skip })
    //   .then(([posts]) => {
    //     return posts;
    //   });

    return this.feedPostRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .orderBy('posts.createdAt', 'DESC')
      .take(takeValue)
      .skip(skip)
      .getMany();
  }

  async findById(id: number) {
    return this.feedPostRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async create(
    createFeedPostDto: Readonly<CreateFeedPostDto>,
    user: UserInterface,
  ) {
    delete user.password;
    return this.feedPostRepository.save({ ...createFeedPostDto, author: user });
  }

  async update(id: number, updateFeedPostDto: UpdateFeedPostDto) {
    const post = await this.findById(id);
    console.log(updateFeedPostDto, 'updateFeedPostDto');
    post.body = updateFeedPostDto.body;
    return this.feedPostRepository.save(post);
  }

  async delete(id: number) {
    const post = await this.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.feedPostRepository.remove(post);
  }
}
