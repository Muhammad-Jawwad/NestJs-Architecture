import { IsString, IsEmail, IsNotEmpty, IsIn, MinLength } from 'class-validator';

export class googleAuthDTO {

  @IsNotEmpty()
  @IsString()
  token: string;
}
