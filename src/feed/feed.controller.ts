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
import { JwtGuard } from '../auth/jwt.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // @Get()
  // async findAll) {
  //   return this.feedService.findAll();
  // }

  @Get()
  @UseGuards(JwtGuard)
  async findSelected(@Query() findOptions: FindOptionsDto) {
    console.log(findOptions);
    return this.feedService.findPost(findOptions);
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body(ValidationPipe) createFeedPostDto: CreateFeedPostDto,
    @Req() req,
  ) {
    return this.feedService.create(createFeedPostDto, req.user);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateFeedPostDto: UpdateFeedPostDto,
  ) {
    return this.feedService.update(id, updateFeedPostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.feedService.delete(id);
  }
}
