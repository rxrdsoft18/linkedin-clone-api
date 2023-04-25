import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';
import { UserInterface } from '../user/interfaces/user.interface';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { UserServiceInterface } from '../user/interfaces/user.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserServiceInterface,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    return user;
  }
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const { firstName, lastName, email, password } = registerDto;
    const hashedPassword = await this.hashPassword(password);
    return this.userService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  }

  async getJwtUser(token: string): Promise<UserInterface> {
    if (!token) {
      return null;
    }

    const { user } = await this.jwtService.verifyAsync(token);
    return user;
  }
}
