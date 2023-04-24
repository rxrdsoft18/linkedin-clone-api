import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { FriendRequestStatus } from '../friend-request-status.enum';

@Entity('friend_request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;

  @ManyToOne(() => UserEntity, (user) => user.sentFriendRequests)
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedFriendRequests)
  receiver: UserEntity;
}
