import {
  Body,
  Controller,
  HttpCode,
  HttpStatus, Inject,
  Post,
  ValidationPipe
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthServiceInterface } from './interfaces/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthServiceInterface,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
