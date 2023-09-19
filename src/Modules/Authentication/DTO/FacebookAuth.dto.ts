import { IsString, IsEmail, IsNotEmpty, IsIn, MinLength } from 'class-validator';

export class facebookAuthDTO {

  @IsNotEmpty()
  @IsString()
  token: string;
}
