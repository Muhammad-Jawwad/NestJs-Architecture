import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength,  } from "class-validator";
import { Roles } from "src/Utilities/Template/types";


export class updateUserDTO {
    // @IsString()
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEnum(Roles)
    role?: Roles;

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

