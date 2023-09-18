// auth.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthType } from 'src/Utilities/Template/types';
import { googleAuthDTO } from './GoogleAuth.dto';
import { jwtAuthDTO } from './JwtAuth.dto';

export class AuthDTO {

  @IsNotEmpty()
  @IsEnum(AuthType)
  type: AuthType;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  token?: string;

  // @ValidateNested({ each: true })
  // @Type(() => jwtAuthDTO)
  // jwt?: jwtAuthDTO;

  // @ValidateNested({ each: true })
  // @Type(() => googleAuthDTO)
  // google?: googleAuthDTO;
}
