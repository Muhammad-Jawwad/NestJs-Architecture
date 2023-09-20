import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { Roles } from 'src/Utilities/Template/types';
import { LessThan } from 'typeorm';
export class createUserDTO {

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(Roles)
    role: Roles;

    @IsNotEmpty()
    @IsString()
    picture: string

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @IsPhoneNumber('PK')
    contact: string;

}