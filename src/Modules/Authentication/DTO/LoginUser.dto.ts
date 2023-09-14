import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsPositive, MinLength } from 'class-validator';
import { LessThan } from 'typeorm';
export class loginUserDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

}