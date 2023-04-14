import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFeedPostDto {
  @IsString()
  @IsNotEmpty()
  body?: string;
}
