// auth.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthType } from 'src/Utilities/Template/types';
import { googleAuthDTO } from './GoogleAuth.dto';
import { jwtAuthDTO } from './JwtAuth.dto';
import { facebookAuthDTO } from './FacebookAuth.dto';
import { amazonAuthDTO } from './AmazonAuth.dto';

export class AuthDTO {

  @IsNotEmpty()
  @IsEnum(AuthType)
  type: AuthType;

  // @IsOptional()
  // @IsString()
  // @IsEmail()
  // email?: string;

  // @IsOptional()
  // @IsString()
  // @MinLength(6)
  // password?: string;

  // @IsOptional()
  // @IsString()
  // token?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => jwtAuthDTO)
  jwt?: jwtAuthDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => googleAuthDTO)
  google?: googleAuthDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => facebookAuthDTO)
  facebook?: facebookAuthDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => amazonAuthDTO)
  amazon?: amazonAuthDTO;
}
