import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsPositive, MinLength } from 'class-validator';
import { LessThan } from 'typeorm';
export class createUserDTO {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsPositive()
    age: number;

    @IsNotEmpty()
    @IsPhoneNumber('PK')
    contact: string;

}