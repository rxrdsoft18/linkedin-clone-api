import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedPostDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}
