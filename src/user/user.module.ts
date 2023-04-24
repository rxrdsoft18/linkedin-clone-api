import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = file.originalname.toLowerCase().split(' ').join('-');
          cb(null, `${Date.now()}-${fileName}`);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
