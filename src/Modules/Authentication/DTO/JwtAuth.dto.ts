import { IsString, IsEmail, IsNotEmpty, IsIn, MinLength } from 'class-validator';
import { AuthType } from 'src/Utilities/Template/types';

export class jwtAuthDTO {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
