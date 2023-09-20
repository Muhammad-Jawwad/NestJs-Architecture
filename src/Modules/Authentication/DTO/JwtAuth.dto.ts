import { IsString, IsEmail, IsNotEmpty, IsIn, MinLength, IsEnum } from 'class-validator';
import { AuthType, Roles } from 'src/Utilities/Template/types';

export class jwtAuthDTO {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
