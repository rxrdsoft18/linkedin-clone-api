import {
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserServiceInterface } from './interfaces/user.service.interface';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserServiceInterface,
  ) {}

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
    console.log(req.user);
    await this.userService.removeImageByImageName(req.user.id);
    return this.userService.updateUserImageById(req.user.id, file.filename);
  }

  @UseGuards(JwtGuard)
  @Get('image')
  async getImage(@Req() req, @Res() res) {
    const image = await this.userService.findImageNameByUserId(req.user.id);
    return res.sendFile(image, { root: 'uploads' });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.findById(id);
  }
}
