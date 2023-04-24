import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './entities/feed-post.entity';
import { UserModule } from '../user/user.module';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { FeedRepository } from './repositories/feed.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FeedPostEntity]), UserModule],
  controllers: [FeedController],
  providers: [
    FeedService,
    IsCreatorGuard,
    {
      provide: 'FeedRepositoryInterface',
      useClass: FeedRepository,
    },
  ],
})
export class FeedModule {}
