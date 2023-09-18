import { IsString, IsEmail, IsNotEmpty, IsIn, MinLength } from 'class-validator';
import { AuthType } from 'src/Utilities/Template/types';

export class googleAuthDTO {
  @IsNotEmpty()
  @IsString()
  type: AuthType;

  @IsNotEmpty()
  @IsString()
  token: string;
}
