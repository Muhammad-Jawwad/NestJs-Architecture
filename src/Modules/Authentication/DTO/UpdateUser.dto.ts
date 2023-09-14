import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength,  } from "class-validator";


export class updateUserDTO {
    // @IsString()
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;


    @IsOptional()
    @IsPositive()
    age?: number;

    @IsOptional()
    @IsPhoneNumber('PK')
    contact?: string;

}

