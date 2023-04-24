import { BaseAbstractRepository } from '../../shared/repositories/base/base-abstract.repository';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class FriendRequestRepository extends BaseAbstractRepository<FriendRequestEntity> {
  constructor(
    @InjectRepository(FriendRequestEntity)
    friendRequestEntity: Repository<FriendRequestEntity>,
  ) {
    super(friendRequestEntity);
  }
}
