import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedPostDto } from './dtos/create-feed-post.dto';
import { UpdateFeedPostDto } from './dtos/update-feed-post.dto';
import { FindOptionsDto } from './dtos/find-options.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // @Get()
  // async findAll) {
  //   return this.feedService.findAll();
  // }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getFeedById(@Param('id') id: number) {
    return this.feedService.findById(id);
  }

  @Get()
  @UseGuards(JwtGuard)
  async findSelected(@Query() findOptions: FindOptionsDto) {
    // console.log(findOptions);
    return this.feedService.findPosts(findOptions);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.PREMIUM)
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  async create(
    @Body(ValidationPipe) createFeedPostDto: CreateFeedPostDto,
    @Req() req,
  ) {
    return this.feedService.create(createFeedPostDto, req.user);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateFeedPostDto: UpdateFeedPostDto,
  ) {
    return this.feedService.update(id, updateFeedPostDto);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.feedService.delete(id);
  }
}
