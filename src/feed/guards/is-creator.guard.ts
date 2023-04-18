import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FeedService } from '../feed.service';
import { RoleEnum } from '../../user/role.enum';
import { UserService } from '../../user/user.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private readonly feedService: FeedService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    if (!user || !params) {
      return false;
    }

    // Admins can do anything
    if (user.role === RoleEnum.ADMIN) return true;

    const userId = user.id;
    const postId = +params.id;

    const userFound = await this.userService.findById(userId);
    const postFound = await this.feedService.findById(postId);

    // Determine if the user is the creator of the post
    return userFound && postFound && userFound.id === postFound.author.id;
  }
}
