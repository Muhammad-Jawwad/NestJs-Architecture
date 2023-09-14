import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsPositive, MinLength } from 'class-validator';
import { LessThan } from 'typeorm';
export class resetPasswordDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

}