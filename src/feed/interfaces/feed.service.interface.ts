import { UpdateFeedPostDto } from '../dtos/update-feed-post.dto';
import { UserInterface } from '../../user/interfaces/user.interface';
import { CreateFeedPostDto } from '../dtos/create-feed-post.dto';
import { FindOptionsDto } from '../dtos/find-options.dto';

export interface FeedServiceInterface {
  findPosts(findOptions: FindOptionsDto);
  findById(id: number);
  create(createFeedPostDto: Readonly<CreateFeedPostDto>, user: UserInterface);
  update(id: number, updateFeedPostDto: UpdateFeedPostDto);
  delete(id: number);
}
