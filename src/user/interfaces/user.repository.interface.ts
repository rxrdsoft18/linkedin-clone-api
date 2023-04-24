import { BaseInterfaceRepository } from '../../shared/repositories/base/base-interface.repository';
import { UserEntity } from '../entities/user.entity';

export type UserRepositoryInterface = BaseInterfaceRepository<UserEntity>;
