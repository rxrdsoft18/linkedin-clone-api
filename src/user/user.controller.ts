import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {}))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|png|jpeg)/g,
          }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req,
  ) {
    return this.userService.updateUserImageById(req.user.id, file.filename);
  }

  @Get('image')
  async getImage() {
    return 'image';
  }
}
