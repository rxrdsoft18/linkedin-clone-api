import { BaseInterfaceRepository } from '../../shared/repositories/base/base-interface.repository';
import { FriendRequestEntity } from '../entities/friend-request.entity';

export type FriendRequestRepositoryInterface =
  BaseInterfaceRepository<FriendRequestEntity>;
