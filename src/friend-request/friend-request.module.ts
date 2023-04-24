import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { UserModule } from '../user/user.module';
import { FriendRequestRepository } from './repositories/friend-request.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequestEntity]), UserModule],
  controllers: [FriendRequestController],
  providers: [
    FriendRequestService,
    {
      provide: 'FriendRequestRepositoryInterface',
      useClass: FriendRequestRepository,
    },
  ],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
