import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './entities/feed-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedPostEntity])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
