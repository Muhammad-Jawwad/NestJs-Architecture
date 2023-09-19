import { IsString, IsEmail, IsNotEmpty, IsIn, MinLength } from 'class-validator';

export class amazonAuthDTO {

  @IsNotEmpty()
  @IsString()
  token: string;
}
